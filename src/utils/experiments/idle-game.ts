import { Application, Assets, Container, Graphics, Sprite, Texture } from "pixi.js";

import animalBeaver from "../../assets/experiments/idle-game/animals/animal-beaver.png";
import animalBee from "../../assets/experiments/idle-game/animals/animal-bee.png";
import animalBunny from "../../assets/experiments/idle-game/animals/animal-bunny.png";
import animalCat from "../../assets/experiments/idle-game/animals/animal-cat.png";
import animalCaterpillar from "../../assets/experiments/idle-game/animals/animal-caterpillar.png";
import animalChick from "../../assets/experiments/idle-game/animals/animal-chick.png";
import animalCow from "../../assets/experiments/idle-game/animals/animal-cow.png";
import animalCrab from "../../assets/experiments/idle-game/animals/animal-crab.png";
import animalDeer from "../../assets/experiments/idle-game/animals/animal-deer.png";
import animalDog from "../../assets/experiments/idle-game/animals/animal-dog.png";
import animalElephant from "../../assets/experiments/idle-game/animals/animal-elephant.png";
import animalFish from "../../assets/experiments/idle-game/animals/animal-fish.png";
import animalFox from "../../assets/experiments/idle-game/animals/animal-fox.png";
import animalGiraffe from "../../assets/experiments/idle-game/animals/animal-giraffe.png";
import animalHog from "../../assets/experiments/idle-game/animals/animal-hog.png";
import animalKoala from "../../assets/experiments/idle-game/animals/animal-koala.png";
import animalLion from "../../assets/experiments/idle-game/animals/animal-lion.png";
import animalMonkey from "../../assets/experiments/idle-game/animals/animal-monkey.png";
import animalPanda from "../../assets/experiments/idle-game/animals/animal-panda.png";
import animalParrot from "../../assets/experiments/idle-game/animals/animal-parrot.png";
import animalPenguin from "../../assets/experiments/idle-game/animals/animal-penguin.png";
import animalPig from "../../assets/experiments/idle-game/animals/animal-pig.png";
import animalPolar from "../../assets/experiments/idle-game/animals/animal-polar.png";
import animalTiger from "../../assets/experiments/idle-game/animals/animal-tiger.png";

type AnimalSpeciesId =
  | "beaver"
  | "bee"
  | "bunny"
  | "cat"
  | "caterpillar"
  | "chick"
  | "cow"
  | "crab"
  | "deer"
  | "dog"
  | "elephant"
  | "fish"
  | "fox"
  | "giraffe"
  | "hog"
  | "koala"
  | "lion"
  | "monkey"
  | "panda"
  | "parrot"
  | "penguin"
  | "pig"
  | "polar"
  | "tiger";

type ParticleKind = "heart" | "sparkle" | "dot";

interface AnimalDefinition {
  id: AnimalSpeciesId;
  label: string;
  asset: string;
  weight: number;
  baseScale: number;
}

interface Needs {
  hunger: number;
  happiness: number;
}

interface Resources {
  food: number;
  foodCapacity: number;
  populationCap: number;
  populateCooldownUntil: number;
}

interface PersistedAnimal extends Needs {
  id: string;
  species: AnimalSpeciesId;
  x: number;
  y: number;
  age: number;
  growth: number;
}

interface IdleGameState {
  animals: PersistedAnimal[];
  resources: Resources;
  paused: boolean;
  lastUpdatedAt: number;
  lastMessage: string;
}

interface Animal extends PersistedAnimal {
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  wanderCooldown: number;
  feedTargetUntil: number;
  bounce: number;
  bounceVelocity: number;
  bobPhase: number;
  scaleJitter: number;
  turnImpulse: number;
  spriteScale: number;
  definition: AnimalDefinition;
  view: AnimalSpriteView;
}

interface AnimalSpriteView {
  container: Container;
  sprite: Sprite;
  shadow: Graphics;
}

interface Particle {
  graphic: Graphics;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  spin: number;
}

interface IdleGameMount {
  destroy: () => void;
}

interface UIRefs {
  root: HTMLElement;
  stage: HTMLElement;
  population: HTMLElement;
  food: HTMLElement;
  mood: HTMLElement;
  cooldown: HTMLElement;
  summary: HTMLElement;
  feedback: HTMLElement;
  feedButton: HTMLButtonElement;
  populateButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
}

const STORAGE_KEY = "idle-game";
const ROOT_SELECTOR = "[data-idle-game-root]";
const MAX_OFFLINE_MS = 1000 * 60 * 60 * 6;
const FEED_COST = 10;
const FOOD_REGEN_PER_SECOND = 1.45;
const POPULATE_COOLDOWN_MS = 18000;
const STARTING_FOOD = 64;
const STARTING_POPULATION = 7;
const WORLD_WIDTH = 12;
const WORLD_DEPTH = 12;
const WORLD_TILE_COLUMNS = 9;
const WORLD_TILE_ROWS = 9;
const WORLD_PADDING = 0.9;
const BABY_GROWTH_SECONDS = 28;
const HUNGER_DECAY_PER_SECOND = 0.009;
const HAPPINESS_DECAY_PER_SECOND = 0.004;
const IDLE_BOB_AMPLITUDE = 9;
const RECOMMENDED_MAX_DPR = 2;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FEEDBACK_LOW_CAP_THRESHOLD = 0.8;

const animalDefinitions: AnimalDefinition[] = [
  { id: "beaver", label: "Beaver", asset: animalBeaver, weight: 1, baseScale: 0.92 },
  { id: "bee", label: "Bee", asset: animalBee, weight: 1, baseScale: 0.8 },
  { id: "bunny", label: "Bunny", asset: animalBunny, weight: 2, baseScale: 0.9 },
  { id: "cat", label: "Cat", asset: animalCat, weight: 2, baseScale: 0.92 },
  { id: "caterpillar", label: "Caterpillar", asset: animalCaterpillar, weight: 1, baseScale: 0.82 },
  { id: "chick", label: "Chick", asset: animalChick, weight: 2, baseScale: 0.82 },
  { id: "cow", label: "Cow", asset: animalCow, weight: 1, baseScale: 0.95 },
  { id: "crab", label: "Crab", asset: animalCrab, weight: 1, baseScale: 0.86 },
  { id: "deer", label: "Deer", asset: animalDeer, weight: 1, baseScale: 0.94 },
  { id: "dog", label: "Dog", asset: animalDog, weight: 2, baseScale: 0.93 },
  { id: "elephant", label: "Elephant", asset: animalElephant, weight: 1, baseScale: 1 },
  { id: "fish", label: "Fish", asset: animalFish, weight: 1, baseScale: 0.82 },
  { id: "fox", label: "Fox", asset: animalFox, weight: 2, baseScale: 0.92 },
  { id: "giraffe", label: "Giraffe", asset: animalGiraffe, weight: 1, baseScale: 1.02 },
  { id: "hog", label: "Hog", asset: animalHog, weight: 1, baseScale: 0.9 },
  { id: "koala", label: "Koala", asset: animalKoala, weight: 1, baseScale: 0.88 },
  { id: "lion", label: "Lion", asset: animalLion, weight: 1, baseScale: 0.96 },
  { id: "monkey", label: "Monkey", asset: animalMonkey, weight: 1, baseScale: 0.93 },
  { id: "panda", label: "Panda", asset: animalPanda, weight: 1, baseScale: 0.94 },
  { id: "parrot", label: "Parrot", asset: animalParrot, weight: 1, baseScale: 0.86 },
  { id: "penguin", label: "Penguin", asset: animalPenguin, weight: 1, baseScale: 0.9 },
  { id: "pig", label: "Pig", asset: animalPig, weight: 2, baseScale: 0.92 },
  { id: "polar", label: "Polar Bear", asset: animalPolar, weight: 1, baseScale: 0.95 },
  { id: "tiger", label: "Tiger", asset: animalTiger, weight: 1, baseScale: 0.95 },
];

const animalDefinitionMap = new Map(animalDefinitions.map((definition) => [definition.id, definition]));

const palette = {
  fieldTop: 0xdff6dc,
  fieldBottom: 0x9ecf9b,
  tileA: 0xffffff,
  tileB: 0xe8f7e5,
  tileStroke: 0xcde7ca,
  shadow: 0x6a7f71,
  hudText: 0x2a4139,
  heart: [0xffc0d8, 0xff9ac2, 0xffe0ec],
  sparkle: [0xffef9f, 0xffd56a, 0xfffbdb],
  confetti: [0xc1f0d1, 0xbbd9ff, 0xffd2a1, 0xe4d1ff],
};

let activeGame: IdleGameMount | null = null;
let activeMountToken = 0;
let cleanupRegistered = false;
let texturesPromise: Promise<Map<AnimalSpeciesId, Texture>> | null = null;

export function initIdleGame(): void {
  const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);

  if (!root) {
    destroyActiveGame();
    return;
  }

  const mountToken = ++activeMountToken;
  destroyActiveGame();

  if (!cleanupRegistered) {
    document.addEventListener(
      "astro:before-preparation",
      () => {
        cleanupRegistered = false;
        destroyActiveGame();
      },
      { once: true },
    );
    cleanupRegistered = true;
  }

  void mountIdleGame(root)
    .then((game) => {
      if (mountToken !== activeMountToken) {
        game.destroy();
        return;
      }

      activeGame = game;
    })
    .catch((error: unknown) => {
      console.error("[IdleGame] Failed to mount idle game", error);
      const feedback = root.querySelector<HTMLElement>("[data-idle-game-feedback]");
      if (feedback) {
        feedback.textContent = "Idle game failed to load. Try refreshing the page.";
      }
    });
}

export async function mountIdleGame(root: HTMLElement): Promise<IdleGameMount> {
  const ui = getUIRefs(root);
  const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
  let reducedMotion = reducedMotionMedia.matches;
  const textures = await loadAnimalTextures();

  const app = new Application();
  await app.init({
    antialias: true,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgl",
    resolution: Math.min(window.devicePixelRatio || 1, RECOMMENDED_MAX_DPR),
    resizeTo: ui.stage,
  });

  ui.stage.replaceChildren(app.canvas);
  app.canvas.className = "idle-game__canvas";
  app.canvas.setAttribute("aria-hidden", "true");

  const backgroundLayer = new Container();
  const worldLayer = new Container();
  const particleLayer = new Container();
  const animalLayer = new Container();
  const ground = new Graphics();
  const worldShadow = new Graphics();

  worldLayer.sortableChildren = true;
  particleLayer.sortableChildren = true;
  animalLayer.sortableChildren = true;

  worldLayer.addChild(worldShadow);
  worldLayer.addChild(ground);
  worldLayer.addChild(animalLayer);
  app.stage.addChild(backgroundLayer);
  app.stage.addChild(worldLayer);
  app.stage.addChild(particleLayer);

  const state = hydrateState();
  let feedbackMessage = state.lastMessage || "A tiny cozy meadow is ready.";
  let saveTimer = 0;
  let summaryTimer = 0;
  let destroyed = false;
  let lastTime = performance.now();
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;
  const particles: Particle[] = [];
  const animals = state.animals.map((persistedAnimal) => createAnimal(persistedAnimal, textures));

  renderBackground(backgroundLayer, ui.stage.clientWidth, ui.stage.clientHeight);
  rebuildGround();
  animals.forEach((animal) => animalLayer.addChild(animal.view.container));
  updateFeedback(feedbackMessage);
  updateHUD();
  updateSummary();
  renderAnimals(0);

  const handleFeed = () => {
    if (state.paused) {
      updateFeedback("Unpause first, then feed the meadow.");
      return;
    }

    if (state.resources.food < FEED_COST) {
      updateFeedback("Not enough food yet — wait for the basket to refill.");
      return;
    }

    state.resources.food = clamp(state.resources.food - FEED_COST, 0, state.resources.foodCapacity);

    const feedPoint = {
      x: randomBetween(-2.2, 2.2),
      y: randomBetween(-1.8, 1.8),
    };

    const nearbyAnimals = [...animals].sort((a, b) => distanceSq(a.x, a.y, feedPoint.x, feedPoint.y) - distanceSq(b.x, b.y, feedPoint.x, feedPoint.y)).slice(0, Math.min(animals.length, 7));

    nearbyAnimals.forEach((animal, index) => {
      animal.targetX = clamp(feedPoint.x + randomBetween(-0.6, 0.6), minX(), maxX());
      animal.targetY = clamp(feedPoint.y + randomBetween(-0.6, 0.6), minY(), maxY());
      animal.feedTargetUntil = performance.now() + 3200 + index * 60;
      animal.hunger = clamp(animal.hunger + 0.34, 0, 1);
      animal.happiness = clamp(animal.happiness + 0.18, 0, 1);
      animal.bounceVelocity += reducedMotion ? 0.8 : 1.8;
      animal.turnImpulse = 1;
    });

    spawnParticleBurst(feedPoint.x, feedPoint.y, "heart", reducedMotion ? 5 : 9);
    updateFeedback(`Snack drop! ${nearbyAnimals.length} animals are waddling over.`);
    persistSoon();
    updateHUD();
    updateSummary();
  };

  const handlePopulate = () => {
    const now = Date.now();

    if (state.paused) {
      updateFeedback("Unpause first, then invite a new baby animal.");
      return;
    }

    if (animals.length >= state.resources.populationCap) {
      updateFeedback("The meadow is full. Feed everyone and wait for a later expansion.");
      return;
    }

    if (state.resources.populateCooldownUntil > now) {
      const remainingSeconds = Math.ceil((state.resources.populateCooldownUntil - now) / 1000);
      updateFeedback(`Populate is cooling down for ${remainingSeconds}s.`);
      return;
    }

    const happyAdults = animals.filter((animal) => animal.growth >= 0.96 && animal.happiness >= 0.62 && animal.hunger >= 0.45);
    if (happyAdults.length < 2) {
      updateFeedback("Keep at least two adult animals happy and fed before populating.");
      return;
    }

    const species = weightedChoice(animalDefinitions, Math.random);
    const baby = createAnimal(
      {
        id: createAnimalId(),
        species: species.id,
        x: clamp(randomBetween(-1.4, 1.4), minX(), maxX()),
        y: clamp(randomBetween(-1.1, 1.1), minY(), maxY()),
        age: 0,
        growth: 0.58,
        hunger: 0.84,
        happiness: 0.82,
      },
      textures,
    );

    animals.push(baby);
    animalLayer.addChild(baby.view.container);

    happyAdults.slice(0, 2).forEach((animal) => {
      animal.happiness = clamp(animal.happiness - 0.08, 0, 1);
      animal.bounceVelocity += reducedMotion ? 0.6 : 1.2;
    });

    state.resources.populateCooldownUntil = now + POPULATE_COOLDOWN_MS;
    spawnParticleBurst(baby.x, baby.y, "sparkle", reducedMotion ? 10 : 16);
    spawnParticleBurst(baby.x, baby.y, "dot", reducedMotion ? 7 : 10);
    updateFeedback(`A tiny ${species.label.toLowerCase()} joined the meadow.`);
    persistSoon();
    updateHUD();
    updateSummary();
  };

  const handlePauseToggle = () => {
    state.paused = !state.paused;
    if (state.paused) {
      app.ticker.stop();
      updateFeedback("Simulation paused.");
    } else {
      lastTime = performance.now();
      app.ticker.start();
      updateFeedback("Simulation resumed.");
    }
    updateHUD();
    persistSoon(true);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      app.ticker.stop();
    } else if (!state.paused) {
      lastTime = performance.now();
      app.ticker.start();
    }
  };

  const handleReducedMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches;
  };

  ui.feedButton.addEventListener("click", handleFeed);
  ui.populateButton.addEventListener("click", handlePopulate);
  ui.pauseButton.addEventListener("click", handlePauseToggle);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotionMedia.addEventListener("change", handleReducedMotionChange);

  app.ticker.add(() => {
    const now = performance.now();
    const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (destroyed) {
      return;
    }

    if (ui.stage.clientWidth !== lastViewportWidth || ui.stage.clientHeight !== lastViewportHeight) {
      renderBackground(backgroundLayer, ui.stage.clientWidth, ui.stage.clientHeight);
      rebuildGround();
      lastViewportWidth = ui.stage.clientWidth;
      lastViewportHeight = ui.stage.clientHeight;
    }

    if (state.paused) {
      return;
    }

    tickResources(deltaSeconds);
    tickAnimals(deltaSeconds, reducedMotion);
    tickParticles(deltaSeconds, reducedMotion);
    renderAnimals(now * 0.001);

    saveTimer += deltaSeconds;
    summaryTimer += deltaSeconds;

    if (saveTimer >= 1.2) {
      saveTimer = 0;
      persistSoon();
    }

    if (summaryTimer >= 0.2) {
      summaryTimer = 0;
      updateHUD();
      updateSummary();
    }
  });

  if (document.hidden || state.paused) {
    app.ticker.stop();
  }

  function tickResources(deltaSeconds: number): void {
    state.resources.food = clamp(state.resources.food + FOOD_REGEN_PER_SECOND * deltaSeconds, 0, state.resources.foodCapacity);
  }

  function tickAnimals(deltaSeconds: number, prefersReducedMotion: boolean): void {
    const nowMs = Date.now();

    for (const animal of animals) {
      animal.age += deltaSeconds;
      animal.growth = clamp(animal.growth + deltaSeconds / BABY_GROWTH_SECONDS, 0.58, 1);
      animal.hunger = clamp(animal.hunger - HUNGER_DECAY_PER_SECOND * deltaSeconds, 0, 1);
      animal.happiness = clamp(animal.happiness + (animal.hunger - 0.58) * 0.2 * deltaSeconds - HAPPINESS_DECAY_PER_SECOND * deltaSeconds, 0, 1);

      animal.wanderCooldown -= deltaSeconds;
      if (animal.feedTargetUntil <= performance.now() && animal.wanderCooldown <= 0) {
        animal.targetX = clamp(animal.x + randomBetween(-2.8, 2.8), minX(), maxX());
        animal.targetY = clamp(animal.y + randomBetween(-2.6, 2.6), minY(), maxY());
        animal.wanderCooldown = randomBetween(1.2, 3.4);
      }

      let separationX = 0;
      let separationY = 0;

      for (const other of animals) {
        if (other === animal) {
          continue;
        }

        const dx = animal.x - other.x;
        const dy = animal.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < 1.25) {
          const strength = (1.25 - distance) / 1.25;
          separationX += (dx / distance) * strength;
          separationY += (dy / distance) * strength;
        }
      }

      const targetDx = animal.targetX - animal.x;
      const targetDy = animal.targetY - animal.y;
      const targetDistance = Math.hypot(targetDx, targetDy) || 1;
      const hungerUrgency = 0.6 + (1 - animal.hunger) * 0.45;
      const maxSpeed = animal.feedTargetUntil > performance.now() ? 1.8 : 1.1 + hungerUrgency * 0.8;
      const desiredX = (targetDx / targetDistance) * maxSpeed + separationX * 0.55;
      const desiredY = (targetDy / targetDistance) * maxSpeed + separationY * 0.55;

      animal.vx += (desiredX - animal.vx) * Math.min(5 * deltaSeconds, 1);
      animal.vy += (desiredY - animal.vy) * Math.min(5 * deltaSeconds, 1);
      animal.vx *= 0.92;
      animal.vy *= 0.92;

      const previousVelocityX = animal.vx;
      const previousVelocityY = animal.vy;

      animal.x = clamp(animal.x + animal.vx * deltaSeconds, minX(), maxX());
      animal.y = clamp(animal.y + animal.vy * deltaSeconds, minY(), maxY());

      if (animal.x <= minX() || animal.x >= maxX()) {
        animal.vx *= -0.4;
      }

      if (animal.y <= minY() || animal.y >= maxY()) {
        animal.vy *= -0.4;
      }

      const turnDelta = Math.abs(previousVelocityX - animal.vx) + Math.abs(previousVelocityY - animal.vy);
      if (turnDelta > 0.05) {
        animal.turnImpulse = clamp(animal.turnImpulse + turnDelta * 1.5, 0, 1);
      }

      const springTension = prefersReducedMotion ? 7 : 12;
      const springDamping = prefersReducedMotion ? 0.78 : 0.72;
      animal.bounceVelocity += (-animal.bounce * springTension + animal.turnImpulse * (prefersReducedMotion ? 0.4 : 0.85)) * deltaSeconds * 8;
      animal.bounceVelocity *= springDamping;
      animal.bounce += animal.bounceVelocity * deltaSeconds * 5;
      animal.turnImpulse *= prefersReducedMotion ? 0.72 : 0.62;

      if (nowMs > state.resources.populateCooldownUntil && animals.length / state.resources.populationCap >= FEEDBACK_LOW_CAP_THRESHOLD) {
        feedbackMessage = "The meadow is getting cosy — population cap is almost full.";
      }
    }
  }

  function tickParticles(deltaSeconds: number, prefersReducedMotion: boolean): void {
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.life -= deltaSeconds;
      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.z += particle.vz * deltaSeconds;
      particle.vz -= prefersReducedMotion ? 0.6 * deltaSeconds : 1.5 * deltaSeconds;
      particle.graphic.rotation += particle.spin * deltaSeconds;

      if (particle.life <= 0) {
        particle.graphic.destroy();
        particles.splice(index, 1);
        continue;
      }

      const { x, y } = project(particle.x, particle.y, particle.z);
      const lifeRatio = particle.life / particle.maxLife;
      particle.graphic.position.set(x, y);
      particle.graphic.alpha = lifeRatio;
      particle.graphic.scale.set(0.6 + (1 - lifeRatio) * 0.45);
      particle.graphic.zIndex = y + 400;
    }
  }

  function renderAnimals(time: number): void {
    for (const animal of animals) {
      const bob = reducedMotion ? Math.sin(time * 1.4 + animal.bobPhase) * 2 : Math.sin(time * 2 + animal.bobPhase) * IDLE_BOB_AMPLITUDE;
      const bounce = animal.bounce * (reducedMotion ? 3 : 7);
      const screen = project(animal.x, animal.y, 0);
      const scale = animal.spriteScale * animal.growth;
      const moodTint = applyMoodTint(animal);
      const speed = Math.hypot(animal.vx, animal.vy);
      const stretch = clamp(speed * 0.09 + Math.abs(animal.bounce) * 0.08, 0, reducedMotion ? 0.05 : 0.14);
      const direction = animal.vx >= 0 ? 1 : -1;

      animal.view.container.position.set(screen.x, screen.y - bob - bounce);
      animal.view.container.zIndex = screen.y;
      animal.view.sprite.scale.set(direction * scale * (1 + stretch), scale * (1 - stretch * 0.65));
      animal.view.sprite.tint = moodTint;
      animal.view.shadow.scale.set(scale * 0.85 + stretch * 0.15, scale * 0.55 - stretch * 0.08);
      animal.view.shadow.alpha = clamp(0.18 + animal.growth * 0.08 - Math.abs(bob + bounce) * 0.008, 0.08, 0.3);
    }
  }

  function rebuildGround(): void {
    const width = ui.stage.clientWidth;
    const height = Math.max(ui.stage.clientHeight, 420);
    lastViewportWidth = width;
    lastViewportHeight = height;
    renderBackground(backgroundLayer, width, height);

    ground.clear();
    worldShadow.clear();

    const centerX = width * 0.5;
    const centerY = height * 0.35;
    const isoX = Math.min(width / 16, 42);
    const isoY = isoX * 0.48;

    worldShadow.ellipse(centerX, centerY + isoY * 5.5, isoX * 5.6, isoY * 4.8).fill({
      alpha: 0.14,
      color: palette.shadow,
    });

    for (let column = 0; column < WORLD_TILE_COLUMNS; column += 1) {
      for (let row = 0; row < WORLD_TILE_ROWS; row += 1) {
        const worldX = (column - WORLD_TILE_COLUMNS / 2) * 1.45;
        const worldY = (row - WORLD_TILE_ROWS / 2) * 1.45;
        const top = project(worldX, worldY, 0);
        const left = { x: top.x - isoX, y: top.y + isoY };
        const right = { x: top.x + isoX, y: top.y + isoY };
        const bottom = { x: top.x, y: top.y + isoY * 2 };
        const tileColor = (column + row) % 2 === 0 ? palette.tileA : palette.tileB;

        ground
          .moveTo(top.x, top.y)
          .lineTo(right.x, right.y)
          .lineTo(bottom.x, bottom.y)
          .lineTo(left.x, left.y)
          .closePath()
          .fill({ alpha: 0.2, color: tileColor })
          .stroke({ alpha: 0.28, color: palette.tileStroke, width: 1 });
      }
    }
  }

  function spawnParticleBurst(worldX: number, worldY: number, kind: ParticleKind, count: number): void {
    for (let index = 0; index < count; index += 1) {
      const graphic = new Graphics();
      const color = pickParticleColor(kind);
      drawParticleShape(graphic, kind, color, 4 + Math.random() * 6);
      const particle: Particle = {
        graphic,
        x: worldX + randomBetween(-0.4, 0.4),
        y: worldY + randomBetween(-0.4, 0.4),
        z: Math.random() * 18,
        vx: randomBetween(-0.6, 0.6),
        vy: randomBetween(-0.6, 0.6),
        vz: randomBetween(0.6, 1.2),
        life: randomBetween(0.7, 1.3),
        maxLife: 1.4,
        spin: randomBetween(-1.6, 1.6),
      };

      particleLayer.addChild(graphic);
      particles.push(particle);
    }
  }

  function updateHUD(): void {
    const populationPressure = animals.length / state.resources.populationCap;
    const averageMood = animals.length === 0 ? 0 : animals.reduce((sum, animal) => sum + animal.happiness, 0) / animals.length;
    const cooldownMs = Math.max(0, state.resources.populateCooldownUntil - Date.now());

    ui.population.textContent = `${animals.length}/${state.resources.populationCap}`;
    ui.food.textContent = `${Math.floor(state.resources.food)}/${state.resources.foodCapacity}`;
    ui.mood.textContent = `${Math.round(averageMood * 100)}%`;
    ui.cooldown.textContent = cooldownMs === 0 ? "Ready" : `${(cooldownMs / 1000).toFixed(1)}s`;
    ui.feedback.textContent = feedbackMessage;
    ui.pauseButton.textContent = state.paused ? "Resume" : "Pause";
    ui.feedButton.disabled = state.resources.food < FEED_COST;
    ui.populateButton.disabled = state.paused || animals.length >= state.resources.populationCap || state.resources.populateCooldownUntil > Date.now();
    ui.root.dataset.populationPressure = populationPressure >= 1 ? "full" : populationPressure >= FEEDBACK_LOW_CAP_THRESHOLD ? "warning" : "normal";
  }

  function updateSummary(): void {
    const hungriestAnimal = animals.reduce<Animal | null>((hungriest, animal) => {
      if (!hungriest || animal.hunger < hungriest.hunger) {
        return animal;
      }

      return hungriest;
    }, null);

    const hungriestLabel = hungriestAnimal ? `${hungriestAnimal.definition.label.toLowerCase()} looks the hungriest` : "the meadow is empty";
    ui.summary.textContent = `${animals.length} animals roaming, ${Math.floor(state.resources.food)} food stored, populate ${ui.cooldown.textContent?.toLowerCase() ?? "ready"}, and ${hungriestLabel}.`;
  }

  function updateFeedback(message: string): void {
    feedbackMessage = message;
    ui.feedback.textContent = message;
  }

  function persistSoon(force = false): void {
    state.lastMessage = feedbackMessage;
    state.lastUpdatedAt = Date.now();
    if (force || !destroyed) {
      persistState({
        animals: animals.map((animal) => ({
          id: animal.id,
          species: animal.species,
          x: animal.x,
          y: animal.y,
          age: animal.age,
          growth: animal.growth,
          hunger: animal.hunger,
          happiness: animal.happiness,
        })),
        resources: state.resources,
        paused: state.paused,
        lastUpdatedAt: state.lastUpdatedAt,
        lastMessage: state.lastMessage,
      });
    }
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    persistSoon(true);
    ui.feedButton.removeEventListener("click", handleFeed);
    ui.populateButton.removeEventListener("click", handlePopulate);
    ui.pauseButton.removeEventListener("click", handlePauseToggle);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionMedia.removeEventListener("change", handleReducedMotionChange);
    app.ticker.stop();
    particleLayer.removeChildren().forEach((child) => child.destroy());
    animalLayer.removeChildren().forEach((child) => child.destroy());
    app.destroy(true, { children: true, texture: false, textureSource: false });
    ui.stage.replaceChildren();
  }

  return { destroy };
}

function destroyActiveGame(): void {
  activeGame?.destroy();
  activeGame = null;
}

function getUIRefs(root: HTMLElement): UIRefs {
  const stage = root.querySelector<HTMLElement>("[data-idle-game-stage]");
  const population = root.querySelector<HTMLElement>("[data-idle-game-population]");
  const food = root.querySelector<HTMLElement>("[data-idle-game-food]");
  const mood = root.querySelector<HTMLElement>("[data-idle-game-mood]");
  const cooldown = root.querySelector<HTMLElement>("[data-idle-game-cooldown]");
  const summary = root.querySelector<HTMLElement>("[data-idle-game-summary]");
  const feedback = root.querySelector<HTMLElement>("[data-idle-game-feedback]");
  const feedButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='feed']");
  const populateButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='populate']");
  const pauseButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='pause']");

  if (!stage || !population || !food || !mood || !cooldown || !summary || !feedback || !feedButton || !populateButton || !pauseButton) {
    throw new Error("Idle game mount points are missing.");
  }

  return {
    root,
    stage,
    population,
    food,
    mood,
    cooldown,
    summary,
    feedback,
    feedButton,
    populateButton,
    pauseButton,
  };
}

async function loadAnimalTextures(): Promise<Map<AnimalSpeciesId, Texture>> {
  if (!texturesPromise) {
    texturesPromise = Promise.all(
      animalDefinitions.map(async (definition) => {
        const texture = await Assets.load(definition.asset);
        texture.source.scaleMode = "nearest";
        return [definition.id, texture] as const;
      }),
    ).then((entries) => new Map(entries));
  }

  return texturesPromise;
}

function hydrateState(): IdleGameState {
  if (typeof localStorage === "undefined") {
    return createDefaultState();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    const validated = validateState(parsed);
    if (!validated) {
      return createDefaultState();
    }

    return applyOfflineCatchup(validated);
  } catch {
    return createDefaultState();
  }
}

function persistState(state: IdleGameState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createDefaultState(): IdleGameState {
  const animals = Array.from({ length: STARTING_POPULATION }, (_, index) => {
    const species = weightedChoice(animalDefinitions, seededRandom(`starter-${index}`));
    return {
      id: createAnimalId(),
      species: species.id,
      x: randomBetween(-3.8, 3.8),
      y: randomBetween(-3.4, 3.4),
      age: randomBetween(6, 18),
      growth: 1,
      hunger: randomBetween(0.62, 0.94),
      happiness: randomBetween(0.56, 0.9),
    } satisfies PersistedAnimal;
  });

  return {
    animals,
    resources: {
      food: STARTING_FOOD,
      foodCapacity: 90,
      populationCap: 20,
      populateCooldownUntil: 0,
    },
    paused: false,
    lastUpdatedAt: Date.now(),
    lastMessage: "A fresh pastel meadow has bloomed.",
  };
}

function applyOfflineCatchup(state: IdleGameState): IdleGameState {
  const now = Date.now();
  const elapsedMs = clamp(now - state.lastUpdatedAt, 0, MAX_OFFLINE_MS);
  const elapsedSeconds = elapsedMs / 1000;

  const animals = state.animals.map((animal) => ({
    ...animal,
    age: animal.age + elapsedSeconds,
    growth: clamp(animal.growth + elapsedSeconds / BABY_GROWTH_SECONDS, 0.58, 1),
    hunger: clamp(animal.hunger - HUNGER_DECAY_PER_SECOND * elapsedSeconds, 0, 1),
    happiness: clamp(animal.happiness + (animal.hunger - 0.58) * 0.06 * elapsedSeconds - HAPPINESS_DECAY_PER_SECOND * elapsedSeconds, 0, 1),
  }));

  return {
    ...state,
    animals,
    resources: {
      ...state.resources,
      food: clamp(state.resources.food + FOOD_REGEN_PER_SECOND * elapsedSeconds, 0, state.resources.foodCapacity),
      populateCooldownUntil: Math.max(0, state.resources.populateCooldownUntil - elapsedMs),
    },
    lastUpdatedAt: now,
  };
}

function validateState(input: unknown): IdleGameState | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<IdleGameState>;
  if (!Array.isArray(candidate.animals) || !candidate.resources || typeof candidate.resources !== "object") {
    return null;
  }

  const validatedAnimals = candidate.animals
    .map((animal) => validateAnimal(animal))
    .filter((animal): animal is PersistedAnimal => Boolean(animal))
    .slice(0, 24);

  const resources = candidate.resources as Partial<Resources>;
  if (typeof resources.food !== "number" || typeof resources.foodCapacity !== "number" || typeof resources.populationCap !== "number" || typeof resources.populateCooldownUntil !== "number") {
    return null;
  }

  return {
    animals: validatedAnimals.length > 0 ? validatedAnimals : createDefaultState().animals,
    resources: {
      food: clamp(resources.food, 0, resources.foodCapacity),
      foodCapacity: clamp(resources.foodCapacity, 20, 200),
      populationCap: clamp(resources.populationCap, 6, 40),
      populateCooldownUntil: Math.max(0, resources.populateCooldownUntil),
    },
    paused: Boolean(candidate.paused),
    lastUpdatedAt: typeof candidate.lastUpdatedAt === "number" ? candidate.lastUpdatedAt : Date.now(),
    lastMessage: typeof candidate.lastMessage === "string" ? candidate.lastMessage : "Welcome back to the meadow.",
  };
}

function validateAnimal(input: unknown): PersistedAnimal | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<PersistedAnimal>;
  if (
    typeof candidate.id !== "string" ||
    !animalDefinitionMap.has(candidate.species as AnimalSpeciesId) ||
    typeof candidate.x !== "number" ||
    typeof candidate.y !== "number" ||
    typeof candidate.age !== "number" ||
    typeof candidate.growth !== "number" ||
    typeof candidate.hunger !== "number" ||
    typeof candidate.happiness !== "number"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    species: candidate.species as AnimalSpeciesId,
    x: clamp(candidate.x, -WORLD_WIDTH / 2, WORLD_WIDTH / 2),
    y: clamp(candidate.y, -WORLD_DEPTH / 2, WORLD_DEPTH / 2),
    age: Math.max(0, candidate.age),
    growth: clamp(candidate.growth, 0.58, 1),
    hunger: clamp(candidate.hunger, 0, 1),
    happiness: clamp(candidate.happiness, 0, 1),
  };
}

function createAnimal(persistedAnimal: PersistedAnimal, textures: Map<AnimalSpeciesId, Texture>): Animal {
  const definition = animalDefinitionMap.get(persistedAnimal.species);
  const texture = textures.get(persistedAnimal.species);

  if (!definition || !texture) {
    throw new Error(`Missing animal definition or texture for ${persistedAnimal.species}`);
  }

  const view = createAnimalSprite(texture);
  const bobPhase = hashToUnit(`${persistedAnimal.id}:bob`) * Math.PI * 2;
  const scaleJitter = 0.92 + hashToUnit(`${persistedAnimal.id}:scale`) * 0.16;

  return {
    ...persistedAnimal,
    vx: 0,
    vy: 0,
    targetX: clamp(persistedAnimal.x + randomBetween(-2, 2), minX(), maxX()),
    targetY: clamp(persistedAnimal.y + randomBetween(-2, 2), minY(), maxY()),
    wanderCooldown: randomBetween(0.1, 2.2),
    feedTargetUntil: 0,
    bounce: 0,
    bounceVelocity: 0,
    bobPhase,
    scaleJitter,
    turnImpulse: 0,
    spriteScale: definition.baseScale * scaleJitter,
    definition,
    view,
  };
}

function createAnimalSprite(texture: Texture): AnimalSpriteView {
  const container = new Container();
  const shadow = new Graphics();
  const sprite = new Sprite(texture);

  sprite.anchor.set(0.5, 1);
  sprite.position.set(0, 0);

  shadow.ellipse(0, -6, 28, 16).fill({ alpha: 0.18, color: palette.shadow });
  shadow.position.set(0, 0);

  container.addChild(shadow);
  container.addChild(sprite);

  return {
    container,
    sprite,
    shadow,
  };
}

function applyMoodTint(animal: Animal): number {
  const mood = animal.happiness * 0.6 + animal.hunger * 0.4;

  if (mood > 0.82) {
    return 0xffffff;
  }

  if (mood > 0.52) {
    return 0xf7f2ff;
  }

  return 0xf6e3d4;
}

function renderBackground(layer: Container, width: number, height: number): void {
  layer.removeChildren().forEach((child) => {
    if (child instanceof Sprite) {
      child.texture.destroy(true);
    }
    child.destroy();
  });

  const gradientCanvas = document.createElement("canvas");
  gradientCanvas.width = Math.max(1, Math.round(width));
  gradientCanvas.height = Math.max(1, Math.round(height));

  const context = gradientCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const gradient = context.createLinearGradient(0, 0, 0, gradientCanvas.height);
  gradient.addColorStop(0, "#dff6dc");
  gradient.addColorStop(0.45, "#c5e9bf");
  gradient.addColorStop(1, "#97c796");
  context.fillStyle = gradient;
  context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

  const texture = Texture.from(gradientCanvas);
  const sprite = new Sprite(texture);
  sprite.width = width;
  sprite.height = height;
  layer.addChild(sprite);
}

function project(worldX: number, worldY: number, elevation = 0): { x: number; y: number } {
  const stage = document.querySelector<HTMLElement>("[data-idle-game-stage]");
  const width = stage?.clientWidth ?? 960;
  const height = stage?.clientHeight ?? 560;
  const isoX = Math.min(width / 16, 42);
  const isoY = isoX * 0.48;

  return {
    x: width * 0.5 + (worldX - worldY) * isoX,
    y: height * 0.34 + (worldX + worldY) * isoY - elevation,
  };
}

function drawParticleShape(graphic: Graphics, kind: ParticleKind, color: number, size: number): void {
  graphic.clear();

  if (kind === "heart") {
    graphic
      .moveTo(0, size * 0.35)
      .bezierCurveTo(size * 0.7, -size * 0.35, size * 1.2, size * 0.35, 0, size * 1.2)
      .bezierCurveTo(-size * 1.2, size * 0.35, -size * 0.7, -size * 0.35, 0, size * 0.35)
      .closePath()
      .fill({ alpha: 0.9, color });
    return;
  }

  if (kind === "sparkle") {
    graphic
      .moveTo(0, -size)
      .lineTo(size * 0.28, -size * 0.28)
      .lineTo(size, 0)
      .lineTo(size * 0.28, size * 0.28)
      .lineTo(0, size)
      .lineTo(-size * 0.28, size * 0.28)
      .lineTo(-size, 0)
      .lineTo(-size * 0.28, -size * 0.28)
      .closePath()
      .fill({ alpha: 0.88, color });
    return;
  }

  graphic.circle(0, 0, size * 0.52).fill({ alpha: 0.82, color });
}

function pickParticleColor(kind: ParticleKind): number {
  const colors = kind === "heart" ? palette.heart : kind === "sparkle" ? palette.sparkle : palette.confetti;
  return colors[Math.floor(Math.random() * colors.length)];
}

function weightedChoice<T extends { weight: number }>(items: T[], randomValue: () => number): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = randomValue() * totalWeight;

  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

function seededRandom(seed: string): () => number {
  let value = Math.floor(hashToUnit(seed) * 2147483647) || 1;

  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
}

function hashToUnit(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return ((hash >>> 0) % 1000) / 1000;
}

function createAnimalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `animal-${Math.round(Math.random() * 1_000_000_000)}`;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function minX(): number {
  return -WORLD_WIDTH / 2 + WORLD_PADDING;
}

function maxX(): number {
  return WORLD_WIDTH / 2 - WORLD_PADDING;
}

function minY(): number {
  return -WORLD_DEPTH / 2 + WORLD_PADDING;
}

function maxY(): number {
  return WORLD_DEPTH / 2 - WORLD_PADDING;
}
