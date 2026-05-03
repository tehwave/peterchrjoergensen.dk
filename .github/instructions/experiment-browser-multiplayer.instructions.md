---
applyTo: "**/experiments/browser-multiplayer/**"
---

# Browser Multiplayer Game Design & Technical Document (GDD/TDD)

## 1. 🎯 Vision & Core Pillars
- **Zero-Server Paradigm:** The absolute core of this experiment is a pure Peer-to-Peer (WebRTC) architecture without *any* signaling server. The initial handshake is entirely manual.
- **Immediate Action:** Once connected, players are instantly in the geometry of the game. No complex lobbies.
- **Juice Over Realism:** Perfect anti-cheat and precise simulation matter less than the game feeling punchy, responsive, and tactile. Gamification and visual feedback (squash, stretch, shake) drive the engagement.

## 2. 📱 UX & Controls (Mobile First)
- **Target Form Factor:** Mobile Portrait mode exclusively. The view scales to fit the width of the device, keeping a fixed aspect ratio or fixed logical coordinate playground.
- **Input Method (Absolute Drag):** The user drags their thumb/finger anywhere in the bottom 25% of their screen. 
- **1:1 Mapping:** The paddle's X-coordinate maps exactly to the touch X-coordinate, clamped to the arena bounds. No acceleration curves for input; it feels like putting your finger directly on the paddle.

## 3. ⚖️ Game Mechanics & Physics (2D Air Hockey Hybrid)
- **The Arena:** A constrained vertical rectangle. The Host sits at the top (visually rotated or mirrored so both players see themselves at the bottom locally). 
- **The Paddles:** Horizontal rounded rectangles (capsules). Fixed on the Y-axis. 
- **The Ball (Puck):** Circular collider. 
- **Physics Rules:**
  - **Friction/Drag:** Zero. The ball maintains velocity until hit.
  - **Dynamic Speed / Tension Builder:** The ball gains a cumulative speed multiplier each time a paddle strikes it. This prevents endless rallies and forces a point eventually. The cap is reset whenever a goal is scored.
  - **Paddle Influence ("English/Spin"):** Hitting the ball while moving the paddle horizontally transfers a percentage of the paddle's current X-velocity vector into the ball's X-velocity, allowing players to perform "slice" shots.
  - **Wall Bounces:** Perfect elastic reflection off side walls.
- **Win Condition:** First player to 5 points. Win triggers an elaborate explosion and a "Rematch" prompt.

## 4. 🧃 Art Style & Game Feel Mathematics
The game uses a **Clean Minimalist** aesthetic (high-contrast solid colors, sharp edges, un-cluttered background, no excess neon bloom). Every interaction must be mathematically smoothed to provide the "juice".
- **Hit Pauses (Sleep/Freeze Frames):** 
  - *Light hit (Wall):* 0-10ms pause.
  - *Heavy hit (Paddle):* 20-30ms pause.
  - *Goal Scored:* 100ms pause with color inversion/flash before resetting.
- **Screen Shake:** Applied sequentially after hit pauses. Amplitude is proportional to the ball's velocity vector upon impact. Uses a damped sine wave decay.
- **Squash and Stretch (Scale Transforms):**
  - Ball deforms on impact (flattens against the normal of the collision surface, stretches along it).
  - Uses explicit spring mathematics (Hooke's Law: `F = -kx - cv`) to snap back to 1.0 scale, avoiding linear lerps.
- **VFX & Particles (PixiJS):**
  - **Ball Trails:** A history of the ball's previous 5-10 positions, scaled down and fading out (alpha decay).
  - **Impact Bursts:** Small geometric shapes erupting from the contact point on paddle/wall hits.
- **Springy UI:** Score numbers scale up violently on a point, then spring back to resting size. Menus and buttons do not slide; they overshoot and settle.

## 5. 📡 Network Architecture (WebRTC Data Channels)
- **Topology:** Host-Client model over `RTCDataChannel` (ordered/unreliable where possible for minimum latency, though WebRTC data channels are pseudo-TCP if reliable is set. We prefer `ordered: false, maxRetransmits: 0` for game state updates).
- **The Host (Authority):** 
  - Runs the absolute game loop (`requestAnimationFrame`).
  - Calculates ball physics, scores, and collisions.
  - Broadcasts the `GameStatePayload` at a fixed rate (e.g., 30Hz or 60Hz).
- **The Client (Dumb Terminal + Prediction):** 
  - Renders the `GameStatePayload`.
  - **Client-Side Prediction:** To ensure local juiciness, the Client calculates their *own* paddle movement locally and absolutely based on touch. They send their `InputPayload` to the host constantly.
  - **Interpolation:** The Client uses linear/Hermite interpolation to smoothly animate the ball and the Host's paddle between the 30Hz network ticks, preventing visual stutter.

### 5.1 Recommended Payload Shape
- Keep the protocol intentionally small. Prefer a tiny set of message types rather than a large event system.
- Recommended messages:
  - `input`: local paddle X position, local paddle X velocity, local input tick.
  - `state`: authoritative tick, ball position/velocity, both paddle X positions, both scores, round state.
  - `flow`: countdown start, scored, rematch request, rematch accept, disconnect/forfeit.
- Payload format should remain binary-first for real-time messages. JSON is acceptable for handshake-adjacent flow messages if it materially simplifies debugging.
- The Host remains authoritative for score, puck state, collision results, and round transitions.

### 5.2 Prediction Philosophy
- Prioritize local feel over strict competitive fairness.
- The local player should always see their own paddle respond immediately to touch, even if a later host correction slightly adjusts the rendered position.
- Corrections should bias toward subtle reconciliation instead of visible snapping unless the state diverges badly.
- Host advantage is acceptable for this experiment.

## 6. 🤝 The Serverless Handshake (SDP Flow)
Because we use no signaling server, the UX for connection must be foolproof.
- **Step 1:** UI asks: "Create Game" or "Join Game".
- **Step 2 (Host):** Clicks "Create". Game generates a local WebRTC Offer. The SDP string is aggressively stripped of unused candidates and compressed (Base64 + custom stripping/LZ compression) to ensure it fits cleanly into an SMS, WhatsApp message, or intent URL without truncation. The UI triggers the native **Web Share API** (`navigator.share`) to seamlessly send the secret to the opponent.
- **Step 3 (Client):** Clicks the received link or pastes the Host's string into a box. Client generates an Answer SDP string (also compressed/stripped) and invokes the **Web Share API** to send it back to the Host.
- **Step 4 (Host):** Host pastes the Client's Answer string into a secondary box and clicks "Start".
- **Connection!** Data channel opens, game transitions to the playing state.

### 6.1 Platform Scope And Failure Policy
- **Primary Targets:** iOS Safari and Chrome on Android.
- **Desktop Scope:** Desktop Chrome is a debugging target, not a primary player-facing target.
- **No Fallback Promise:** If a device, browser, or network path cannot complete the pure P2P flow, the game should fail clearly rather than degrade into a different connection model.
- **Failure Messaging:** Prefer blunt, human-readable errors such as "This connection could not be established on this network" over technical WebRTC jargon.
- **Debug Convenience:** A manual copy/paste path is acceptable for local debugging and QA even if the intended player UX is share-driven.

### 6.2 Handshake Constraints
- The handshake UX should assume that some shared payloads may be malformed, truncated, duplicated, or pasted into the wrong step.
- Invalid or stale handshake strings should fail safely and return the player to a clean retry state.
- Do not persist handshake secrets longer than necessary for the current connection attempt.
- Avoid logging raw SDP blobs in normal application logs.

## 7. 🔄 Game State & Flow (State Machine)
- `STATE_HANDSHAKE`: The manual SDP exchange UI.
- `STATE_COUNTDOWN`: "3... 2... 1... GO!", spring-animated text at the start of a round.
- `STATE_PLAYING`: Active physics loop.
- `STATE_SCORED`: Ball explodes/resets, +1 to score, short pause, back to Countdown.
- `STATE_GAMEOVER`: Final UI overlay. Winner declared. "Rematch" button resets score and triggers Countdown (requires Host to agree).
- `STATE_DISCONNECTED`: If a player backgrounds the app or loses signal, the WebRTC connection cuts. This is an **Instant Forfeit (Drop = Loss)**. The survivor sees "Opponent Fled - You Win" and must create a new lobby. No complex reconnection handshake required.

### 7.1 Round Rules
- Missing the puck is an immediate goal for the opponent.
- Each round starts from center.
- After a goal, the next serve launches toward the player who scored.
- Each player should always see themselves at the bottom locally, even if the renderer mirrors the arena presentation per client.

### 7.2 Lifecycle Rules
- This experiment should treat backgrounding, app switching, or hard connection loss as a practical disconnect.
- Orientation changes should not be a supported play pattern. The product is portrait-only.
- If touch is lost unexpectedly (`touchcancel` or equivalent), the paddle should simply stop at its last valid clamped position until new input arrives.

## 8. 🏗️ Technical Implementation & Coordinate Space
- **Language:** Strict TypeScript is mandatory for all logic, leveraging strong typing for the WebRTC payloads and physics models.
- **Dependencies:** **Zero external dependencies** other than PixiJS. All physics (AABB, circle collision), vector math, and visual "juicing" (spring curves, dampening) will be written manually to ensure absolute control and the smallest possible footprint.
- **Separation of Concerns:** 
  1. `Network System`: Handles RTC connections and sending/parsing byte arrays.
  2. `Simulation System`: The math state. Knows nothing about PixiJS or DOM. Written in pure TypeScript with dependency-free mathematical logic.
  3. `Renderer System`: Takes the Simulation State and draws it using PixiJS. Applies the visual juice (squash, particles) independently of the absolute physics state.
- **Logical Coordinate System:** The game operates on a fixed logical space (e.g., 1000 width x 2000 height). The Renderer System calculates the scale factor to fit this logical space uniformly onto the physical mobile viewport. This ensures the physics math is identical on every device, regardless of screen resolution.
- **Payload Packing:** 
  - Avoid sending massive JSON strings per tick. 
  - Pack state into `Float32Array`. 
  - Example Array Structure: `[TickNumber, BallX, BallY, BallVelX, BallVelY, HostPaddleX, ClientPaddleX, HostScore, ClientScore]`.

### 8.1 Recommended Simulation Defaults
- Keep constants centralized in one place so the feel can be tuned quickly during playtesting.
- Recommended starting point only:
  - Logical arena near `1000 x 2000`.
  - Fixed-step simulation preferred, even if rendering stays frame-rate driven.
  - One puck, two paddles, no items, no power-ups.
  - First to 5 points wins.
- The exact values for serve speed, paddle width, puck radius, speed gain, and spin influence should be treated as tuning knobs rather than locked design law.

### 8.2 Renderer Boundaries
- The renderer may exaggerate impact, trails, shake, squash, score pops, and haptics.
- The renderer must not invent gameplay state. Score, puck position, and authoritative collisions come from simulation/host state.
- Visual effects should degrade gracefully on weaker mobile devices by reducing particle counts and trail history before touching core readability.

### 8.3 Acceptance Criteria For The Experiment
- Two phones on supported browsers can complete the handshake and start a match without external infrastructure.
- A full match can be played in portrait mode with readable score, stable controls, and clear win/loss states.
- Local paddle movement feels immediate on both peers.
- Unsupported or failed connections produce a clear failure state instead of hanging indefinitely.
- The experience remains understandable and visually punchy even if network quality is imperfect.

## 9. 🧭 Build Heuristics From Previous Experiments
- Keep the Astro page thin. The page should expose explicit data-attribute mount points for the stage, HUD, handshake flow, status text, and rematch UI, while the game module discovers and validates that contract at runtime.
- Keep semantic UI outside the renderer. Pixi should own the arena, puck, paddles, particles, and impact juice. Connection flow, score text, buttons, failure states, and accessibility messaging should stay in normal DOM.
- Treat Astro view transitions as hostile to long-lived runtimes unless proven otherwise. The experiment should mount idempotently, tear down cleanly on `astro:before-preparation`, and tolerate `astro:page-load` firing multiple times.
- Separate authoritative state from presentation state early. Match state, scores, round flow, and network timing should not live in the same structures as interpolation buffers, squash/stretch values, screen shake, or particles.
- Keep mobile performance constraints explicit from the start. Cap DPR, clamp frame deltas, and degrade cosmetic effects before sacrificing control readability.
- Prefer small, sharply scoped modules over a single large experiment file. The minimum useful split is `network`, `simulation`, `renderer`, and `page/bootstrap`.
- Parse and validate all inbound data defensively. Handshake strings and data channel payloads should fail safely and never be trusted just because they originated from the other player.
- If PixiJS is used, preserve any CSP-compatible import/runtime pattern already required by the site rather than assuming a default Pixi setup will work unchanged.

### 9.1 Things Not To Copy Blindly
- Do not treat multiplayer like a single-player toy loop with networking attached later. Fixed-step host simulation and clear authority boundaries matter immediately.
- Do not let the renderer become the place where gameplay truth is invented. Juice can exaggerate, but it should not decide scores, collisions, or round flow.
- Do not over-invest in persistence or recovery. This experiment's disconnect rule is intentionally harsh, and that simplicity is a feature.
