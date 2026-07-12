# Browser Multiplayer Product and Technical Reference

## Fixed Product Pillars

- Pure peer-to-peer WebRTC with no signaling server. Offer and answer exchange is manual.
- Two players enter the game immediately after connecting; there is no lobby system.
- Game feel and responsiveness outrank anti-cheat sophistication or perfect competitive fairness.
- Primary targets are iOS Safari and Chrome on Android in portrait. Desktop Chrome is a debugging target.
- Unsupported devices or networks fail clearly. Do not substitute another connection model.

## Controls and Rules

The player drags anywhere in the bottom quarter of the screen. Map touch X directly to the local paddle and clamp it to arena bounds; do not add acceleration curves. If touch is cancelled, keep the paddle at its last valid position.

The arena is vertical. Each player sees themselves at the bottom even when presentation must be mirrored. Paddles are fixed-Y capsules and the puck is circular. Physics rules:

- no friction or drag;
- elastic side-wall reflection;
- cumulative puck speed gain on paddle hits, capped and reset after a goal;
- moving-paddle X velocity transfers partly into puck X velocity for spin/slice shots;
- missing the puck scores immediately for the opponent;
- each round resets at center and serves toward the player who scored;
- first to five wins, followed by a pronounced explosion and rematch prompt.

Centralize puck size, paddle size, serve speed, speed gain, cap, and spin influence as playtest tuning values. Prefer fixed-step simulation even if rendering follows animation frames.

## Visual Direction and Game Feel

Use a clean premium sports aesthetic: off-white and ink-black foundations, red host, blue client, flat geometric pieces, sharp edges, and no excessive neon, skeuomorphism, or faux 3D. The game is controlled at rest and loud on impact.

Place a portrait arena inside a framed card. Use a strong border, center line, readable goals, and quiet outer graphics. Keep persistent score/status and all accessible interaction in DOM overlays; Pixi owns arena action and effects. Put large scores above the arena and transient countdown/round messages over it. Respect mobile safe areas and never sacrifice puck, paddle, score, ownership, or goal-direction legibility.

Recommended feel starting points:

- wall hit pause: 0–10 ms;
- paddle hit pause: 20–30 ms;
- goal pause: about 100 ms with flash/inversion;
- damped sine screen shake proportional to impact velocity;
- spring-based squash/stretch using `F = -kx - cv`, not linear lerp;
- five to ten fading puck-trail positions plus small geometric impact bursts;
- score and menus overshoot and settle instead of sliding.

Apply hit pause before shake. Reduce particle count, trails, and other cosmetics on weak devices before weakening controls or readability. Respect reduced-motion preferences for nonessential presentation.

## Network Authority and Protocol

Use a host-client topology over `RTCDataChannel`. Prefer unordered, zero-retransmit delivery for high-frequency state updates when supported. The host runs the authoritative loop and owns puck physics, collisions, score, and round transitions. It broadcasts fixed-rate state snapshots.

The client is a rendering terminal for authoritative state but predicts its own paddle immediately from local input. Reconcile subtly unless divergence is severe. Interpolate or extrapolate remote objects between state ticks. Host advantage is acceptable.

Keep the protocol small:

- `input`: local paddle X, X velocity, and input tick;
- `state`: authoritative tick, puck position/velocity, paddles, scores, and round state;
- `flow`: countdown, score, rematch request/acceptance, disconnect, or forfeit.

Use compact binary payloads such as typed arrays for real-time state. JSON is acceptable for infrequent handshake-adjacent flow when it materially improves debugging. Validate message type, length, ranges, ordering, and state applicability before use.

## Manual Handshake and Failure Policy

1. Ask the player to Create Game or Join Game.
2. Host creates and gathers an offer, strips/compresses it enough for messaging, then shares it with Web Share or manual copy.
3. Client opens/pastes the offer, creates a compressed answer, and shares it back.
4. Host pastes the answer and starts; the match begins when the channel opens.

Manual copy/paste is acceptable for QA even when sharing is the intended UX. Handle malformed, truncated, duplicated, stale, and wrong-step tokens safely. Return to a clean retry state with blunt human-readable errors. Do not retain handshake secrets beyond the connection attempt or log raw SDP in ordinary logs.

## State and Lifecycle

Use explicit states:

- `HANDSHAKE`
- `COUNTDOWN`
- `PLAYING`
- `SCORED`
- `GAMEOVER`
- `DISCONNECTED`

After a score, explode/reset, increment, pause briefly, and return to countdown. Rematch resets scores only after agreement. Backgrounding, app switching, channel loss, or hard connection loss is an instant forfeit; the survivor wins and both players create a new lobby. Do not build reconnection, host migration, or persistence. Portrait orientation changes are unsupported.

Astro navigation may fire lifecycle events repeatedly. Mount idempotently, tear down listeners, animation loops, observers, Pixi, and network state on `astro:before-preparation`, and tolerate repeated `astro:page-load`.

## Architecture

Use strict TypeScript. PixiJS is the only allowed external runtime dependency. Implement vector math, collisions, springs, and damping locally.

Separate at least:

1. network and protocol parsing;
2. pure dependency-free simulation;
3. Pixi renderer and presentation state;
4. page/bootstrap and DOM UI.

The page exposes explicit data-attribute mount points for stage, HUD, handshake, status, and rematch. The renderer never invents game state. Use a fixed logical coordinate space scaled uniformly to the viewport. Cap DPR and frame deltas. Preserve the site's CSP-compatible Pixi import/runtime pattern.

## Acceptance Criteria

- Two supported phones complete the manual handshake without external infrastructure.
- A full portrait match reaches a clear win/loss state with readable score and stable controls.
- Each local paddle responds immediately.
- Network imperfections remain understandable; invalid or failed connections never hang indefinitely.
- Lifecycle navigation does not duplicate or leak runtimes.
- The experience stays visually punchy after cosmetic degradation on weaker devices.
