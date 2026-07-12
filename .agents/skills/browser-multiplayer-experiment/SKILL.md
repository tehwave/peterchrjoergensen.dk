---
name: browser-multiplayer-experiment
description: Use when designing, implementing, reviewing, debugging, or playtesting the browser multiplayer experiment, including WebRTC, PixiJS, host-authoritative simulation, mobile controls, handshake UX, game feel, or lifecycle behavior.
---

# Browser Multiplayer Experiment

## Overview

Build a mobile-first, two-player air-hockey experiment that uses pure peer-to-peer WebRTC and prioritizes immediate control and game feel over competitive infrastructure.

## Required Local Reference

Read `reference.md` completely before changing or reviewing the experiment. It contains the product rules, network authority, manual handshake, state machine, visual direction, architecture boundaries, and acceptance criteria required for this skill. It lives inside this skill and remains available independently of repository instruction files.

Inspect the current implementation before acting. Requirements marked as fixed remain binding; recommended dimensions, rates, timings, and tuning values are starting points unless tests or current code establish an intentional newer value. Call out conflicts rather than silently replacing working behavior.

## Working Contract

- Keep the Astro page thin and semantic UI in the DOM.
- Keep network, simulation, renderer, and bootstrap responsibilities separate.
- Host state owns gameplay truth; prediction and visual effects never do.
- Validate all handshake and network input defensively.
- Treat mobile portrait, safe areas, lifecycle teardown, and weak-device performance as first-class constraints.
- Preserve the zero-server handshake and harsh disconnect policy unless the user explicitly changes the product premise.

## Verification

Run focused pure-logic tests, repository checks/build, lifecycle navigation tests, malformed-payload tests, and real two-phone playtests on iOS Safari and Android Chrome. Confirm failure states as deliberately as the happy path.

## Common Mistakes

- Adding networking after building a single-player loop.
- Letting Pixi or interpolation decide scores or collisions.
- Adding persistence, reconnection, TURN, or a signaling server without product authorization.
- Calling desktop Chrome testing sufficient for a phone-first experiment.
