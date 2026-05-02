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

## 6. 🤝 The Serverless Handshake (SDP Flow)
Because we use no signaling server, the UX for connection must be foolproof.
- **Step 1:** UI asks: "Create Game" or "Join Game".
- **Step 2 (Host):** Clicks "Create". Game generates a local WebRTC Offer. The SDP string is aggressively stripped of unused candidates and compressed (Base64 + custom stripping/LZ compression) to ensure it fits cleanly into an SMS, WhatsApp message, or intent URL without truncation. The UI triggers the native **Web Share API** (`navigator.share`) to seamlessly send the secret to the opponent.
- **Step 3 (Client):** Clicks the received link or pastes the Host's string into a box. Client generates an Answer SDP string (also compressed/stripped) and invokes the **Web Share API** to send it back to the Host.
- **Step 4 (Host):** Host pastes the Client's Answer string into a secondary box and clicks "Start".
- **Connection!** Data channel opens, game transitions to the playing state.

## 7. 🔄 Game State & Flow (State Machine)
- `STATE_HANDSHAKE`: The manual SDP exchange UI.
- `STATE_COUNTDOWN`: "3... 2... 1... GO!", spring-animated text at the start of a round.
- `STATE_PLAYING`: Active physics loop.
- `STATE_SCORED`: Ball explodes/resets, +1 to score, short pause, back to Countdown.
- `STATE_GAMEOVER`: Final UI overlay. Winner declared. "Rematch" button resets score and triggers Countdown (requires Host to agree).
- `STATE_DISCONNECTED`: If a player backgrounds the app or loses signal, the WebRTC connection cuts. This is an **Instant Forfeit (Drop = Loss)**. The survivor sees "Opponent Fled - You Win" and must create a new lobby. No complex reconnection handshake required.

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
