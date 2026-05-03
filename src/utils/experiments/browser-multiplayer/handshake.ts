import { NETWORK, PROTOCOL_VERSION } from "./constants";
import type { HandshakeEnvelope } from "./types";

const HANDSHAKE_PREFIX = "p2p1.";
const FLAG_RAW = 0;
const FLAG_DEFLATE = 1;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type CompressionConstructor = new (format: CompressionFormat) => CompressionStream;
type DecompressionConstructor = new (format: CompressionFormat) => DecompressionStream;

/** User-facing handshake failures. The controller can display these directly. */
export class HandshakeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HandshakeError";
  }
}

/**
 * Encode SDP into a paste/share-safe string. The flag byte lets future decoders know
 * whether the payload is raw JSON or deflated JSON without guessing from content.
 */
export async function encodeHandshake(envelope: HandshakeEnvelope): Promise<string> {
  const jsonBytes = textEncoder.encode(JSON.stringify(envelope));
  const compressed = await maybeCompress(jsonBytes);
  const flag = compressed.compressed ? FLAG_DEFLATE : FLAG_RAW;
  const payload = new Uint8Array(1 + compressed.bytes.byteLength);
  payload[0] = flag;
  payload.set(compressed.bytes, 1);
  return `${HANDSHAKE_PREFIX}${base64UrlEncode(payload)}`;
}

/** Decode and validate one manual signaling code before handing SDP to WebRTC. */
export async function decodeHandshake(code: string, expectedType: "offer" | "answer"): Promise<HandshakeEnvelope> {
  const trimmed = extractHandshakeCode(code);
  if (!trimmed.startsWith(HANDSHAKE_PREFIX)) {
    throw new HandshakeError("That does not look like a game invite or reply.");
  }

  const payload = base64UrlDecode(trimmed.slice(HANDSHAKE_PREFIX.length));
  if (payload.byteLength < 2) {
    throw new HandshakeError("That code is incomplete. Ask for a fresh one.");
  }

  const flag = payload[0];
  const encodedBody = payload.slice(1);
  const body = flag === FLAG_DEFLATE ? await maybeDecompress(encodedBody) : encodedBody;

  let envelope: HandshakeEnvelope;
  try {
    envelope = JSON.parse(textDecoder.decode(body)) as HandshakeEnvelope;
  } catch {
    throw new HandshakeError("That code is damaged. Ask for a fresh one.");
  }

  if (!isValidEnvelope(envelope)) {
    throw new HandshakeError("That code is not a valid game connection code.");
  }

  if (envelope.type !== expectedType) {
    throw new HandshakeError(expectedType === "offer" ? "That is a reply code. Paste an invite code here." : "That is an invite code. Paste the reply code here.");
  }

  if (Date.now() - envelope.createdAt > NETWORK.staleHandshakeMs) {
    throw new HandshakeError("That code is too old. Start a fresh connection.");
  }

  return envelope;
}

/** Keep WebRTC SDP opaque, but attach the metadata needed for version and freshness checks. */
export function createHandshakeEnvelope(type: "offer" | "answer", sdp: RTCSessionDescriptionInit): HandshakeEnvelope {
  return {
    v: PROTOCOL_VERSION,
    type,
    sdp,
    createdAt: Date.now(),
  };
}

/** Human-readable wrapper for native share sheets and manual copy flows. */
export function getShareText(kind: "offer" | "answer", code: string): string {
  const label = kind === "offer" ? "Game invite" : "Game reply";
  return `${label}: ${code}`;
}

function extractHandshakeCode(value: string): string {
  // Share sheets often wrap the code in prose. Pull out the first valid token so
  // pasted messages like "Game invite: p2p1..." still work.
  const match = value.match(/p2p1\.[A-Za-z0-9_-]+/);
  return match?.[0] ?? value.trim();
}

function isValidEnvelope(value: HandshakeEnvelope): value is HandshakeEnvelope {
  return (
    value &&
    value.v === PROTOCOL_VERSION &&
    (value.type === "offer" || value.type === "answer") &&
    typeof value.createdAt === "number" &&
    value.sdp &&
    (value.sdp.type === "offer" || value.sdp.type === "answer") &&
    typeof value.sdp.sdp === "string" &&
    value.sdp.sdp.length > 100
  );
}

async function maybeCompress(bytes: Uint8Array): Promise<{ bytes: Uint8Array; compressed: boolean }> {
  const CompressionStreamCtor = globalThis.CompressionStream as CompressionConstructor | undefined;
  if (!CompressionStreamCtor) return { bytes, compressed: false };

  try {
    // Pipe a Blob stream through CompressionStream instead of writing manually; the
    // writer path can wait for the readable side and stall offer generation.
    const stream = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(new CompressionStreamCtor("deflate"));
    return { bytes: new Uint8Array(await new Response(stream).arrayBuffer()), compressed: true };
  } catch {
    return { bytes, compressed: false };
  }
}

async function maybeDecompress(bytes: Uint8Array): Promise<Uint8Array> {
  const DecompressionStreamCtor = globalThis.DecompressionStream as DecompressionConstructor | undefined;
  if (!DecompressionStreamCtor) {
    throw new HandshakeError("This browser cannot read compressed connection codes.");
  }

  try {
    // Mirror compression with Blob streams so decompression has the same backpressure behavior.
    const stream = new Blob([new Uint8Array(bytes)]).stream().pipeThrough(new DecompressionStreamCtor("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    throw new HandshakeError("That code is damaged. Ask for a fresh one.");
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  // URL-safe base64 keeps the code usable in SMS, chat apps, and Web Share payloads.
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  try {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  } catch {
    throw new HandshakeError("That code is not readable. Ask for a fresh one.");
  }
}
