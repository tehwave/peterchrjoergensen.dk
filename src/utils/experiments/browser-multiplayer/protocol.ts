import { PROTOCOL_VERSION } from "./constants";
import { numberToRole, numberToRoundState, roleToNumber, roundStateToNumber } from "./math";
import type { FlowMessage, ParsedProtocolMessage, PlayerInput, StatePayload } from "./types";

// First byte identifies the frame kind; second byte is the protocol version.
// The rest of binary frames are little-endian float32 values to keep packets small.
const MESSAGE_INPUT = 1;
const MESSAGE_STATE = 2;
const MESSAGE_FLOW = 3;
const INPUT_FLOAT_COUNT = 4;
const STATE_FLOAT_COUNT = 17;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** Pack one absolute paddle sample. Absolute x is resilient to dropped packets. */
export function packInput(input: PlayerInput): ArrayBuffer {
  const buffer = new ArrayBuffer(2 + INPUT_FLOAT_COUNT * 4);
  const view = new DataView(buffer);
  view.setUint8(0, MESSAGE_INPUT);
  view.setUint8(1, PROTOCOL_VERSION);
  view.setFloat32(2, input.tick, true);
  view.setFloat32(6, roleToNumber(input.role), true);
  view.setFloat32(10, input.paddleX, true);
  view.setFloat32(14, input.paddleVx, true);
  return buffer;
}

/** Pack the host-authoritative snapshot sent to the client at `NETWORK.stateHz`. */
export function packState(state: StatePayload): ArrayBuffer {
  const buffer = new ArrayBuffer(2 + STATE_FLOAT_COUNT * 4);
  const view = new DataView(buffer);
  view.setUint8(0, MESSAGE_STATE);
  view.setUint8(1, PROTOCOL_VERSION);
  const values = [
    state.tick,
    roundStateToNumber(state.roundState),
    state.countdownMs,
    state.freezeMs,
    state.ballX,
    state.ballY,
    state.ballVx,
    state.ballVy,
    state.hostPaddleX,
    state.hostPaddleVx,
    state.clientPaddleX,
    state.clientPaddleVx,
    state.hostScore,
    state.clientScore,
    roleToNumber(state.lastScoredBy),
    roleToNumber(state.winner),
    roleToNumber(state.serveToward),
  ];
  values.forEach((value, index) => view.setFloat32(2 + index * 4, value, true));
  return buffer;
}

/** Pack rare semantic events as JSON so they can evolve without changing the hot binary layout. */
export function packFlow(flow: FlowMessage): ArrayBuffer {
  const json = textEncoder.encode(JSON.stringify(flow));
  const buffer = new ArrayBuffer(2 + json.byteLength);
  const bytes = new Uint8Array(buffer);
  bytes[0] = MESSAGE_FLOW;
  bytes[1] = PROTOCOL_VERSION;
  bytes.set(json, 2);
  return buffer;
}

/** Parse untrusted data-channel messages defensively; malformed or wrong-version frames are ignored. */
export function parseProtocolMessage(data: unknown): ParsedProtocolMessage | null {
  const buffer = normalizeBuffer(data);
  if (!buffer || buffer.byteLength < 2) return null;

  const view = new DataView(buffer);
  const type = view.getUint8(0);
  const version = view.getUint8(1);
  if (version !== PROTOCOL_VERSION) return null;

  if (type === MESSAGE_INPUT) return parseInput(view);
  if (type === MESSAGE_STATE) return parseState(view);
  if (type === MESSAGE_FLOW) return parseFlow(buffer);
  return null;
}

function parseInput(view: DataView): ParsedProtocolMessage | null {
  if (view.byteLength !== 2 + INPUT_FLOAT_COUNT * 4) return null;
  const role = numberToRole(view.getFloat32(6, true));
  if (!role) return null;
  return {
    kind: "input",
    input: {
      tick: view.getFloat32(2, true),
      role,
      paddleX: view.getFloat32(10, true),
      paddleVx: view.getFloat32(14, true),
    },
  };
}

function parseState(view: DataView): ParsedProtocolMessage | null {
  if (view.byteLength !== 2 + STATE_FLOAT_COUNT * 4) return null;
  // Indexes mirror `packState()`. Keeping a local reader makes the layout scannable
  // while avoiding object allocations during the hot parse path.
  const read = (index: number) => view.getFloat32(2 + index * 4, true);
  const serveToward = numberToRole(read(16));
  if (!serveToward) return null;

  return {
    kind: "state",
    state: {
      tick: read(0),
      roundState: numberToRoundState(read(1)),
      countdownMs: read(2),
      freezeMs: read(3),
      ballX: read(4),
      ballY: read(5),
      ballVx: read(6),
      ballVy: read(7),
      hostPaddleX: read(8),
      hostPaddleVx: read(9),
      clientPaddleX: read(10),
      clientPaddleVx: read(11),
      hostScore: read(12),
      clientScore: read(13),
      lastScoredBy: numberToRole(read(14)),
      winner: numberToRole(read(15)),
      serveToward,
    },
  };
}

function parseFlow(buffer: ArrayBuffer): ParsedProtocolMessage | null {
  try {
    const flow = JSON.parse(textDecoder.decode(new Uint8Array(buffer, 2))) as FlowMessage;
    if (flow.v !== PROTOCOL_VERSION || typeof flow.type !== "string") return null;
    return { kind: "flow", flow };
  } catch {
    return null;
  }
}

function normalizeBuffer(data: unknown): ArrayBuffer | null {
  if (data instanceof ArrayBuffer) return data;
  if (data instanceof Blob) return null;
  if (ArrayBuffer.isView(data)) {
    // Copy ArrayBufferViews into a standalone ArrayBuffer. This avoids retaining a
    // larger backing buffer and satisfies strict DOM typings around SharedArrayBuffer.
    const copy = new Uint8Array(data.byteLength);
    copy.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    return copy.buffer;
  }
  return null;
}
