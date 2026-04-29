import { Application, Assets, Container, Graphics, Sprite, Text, Texture } from "pixi.js/unsafe-eval";

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
import flowerPurpleA from "../../assets/experiments/idle-game/foliage/flower_purpleA_NE.png";
import flowerRedA from "../../assets/experiments/idle-game/foliage/flower_redA_NE.png";
import flowerRedB from "../../assets/experiments/idle-game/foliage/flower_redB_NE.png";
import flowerYellowA from "../../assets/experiments/idle-game/foliage/flower_yellowA_NE.png";
import grassLarge from "../../assets/experiments/idle-game/foliage/grass_large_NE.png";
import grassLeafsLarge from "../../assets/experiments/idle-game/foliage/grass_leafsLarge_NE.png";
import grassLeafs from "../../assets/experiments/idle-game/foliage/grass_leafs_NE.png";
import grass from "../../assets/experiments/idle-game/foliage/grass_NE.png";
import particleHeart from "../../assets/experiments/idle-game/symbols/heart.png";
import particleStar from "../../assets/experiments/idle-game/symbols/star.png";

import foodApple from "../../assets/experiments/idle-game/food/apple.png";
import foodBurger from "../../assets/experiments/idle-game/food/burger.png";
import foodCarrot from "../../assets/experiments/idle-game/food/carrot.png";
import foodPizza from "../../assets/experiments/idle-game/food/pizza.png";
import foodWatermelon from "../../assets/experiments/idle-game/food/watermelon.png";

const foliageAssets: ImageAsset[] = [flowerPurpleA, flowerRedA, flowerRedB, flowerYellowA, grassLarge, grassLeafsLarge, grassLeafs, grass];
const foodAssets: ImageAsset[] = [foodApple, foodBurger, foodCarrot, foodPizza, foodWatermelon];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
type ParticleKind = "heart" | "star" | "dot" | "zzz";
type DayCyclePhase = "dawn" | "day" | "sunset" | "night";

interface ImageAsset {
  src: string;
}

interface AnimalDefinition {
  id: AnimalSpeciesId;
  label: string;
  asset: ImageAsset;
  weight: number;
  baseScale: number;
  rarity: Rarity;
  shopCost: number;
  coinsPerSecond: number;
}

interface PersistedAnimal {
  id: string;
  species: AnimalSpeciesId;
  x: number;
  y: number;
  age: number;
  growth: number;
  hunger: number;
  happiness: number;
  sleeping: boolean;
}

interface Resources {
  food: number;
  foodCapacity: number;
  coins: number;
  populationCap: number;
  populateCooldownUntil: number;
}

interface IdleGameUpgrades {
  meadowExpansion: number;
  siloStorage: number;
  goldenRations: number;
}

interface IdleGameState {
  // `animals` is the persisted set of representative sprites, not the source of truth for population.
  // Large herds are collapsed visually; economy and caps must read from `owned` instead.
  animals: PersistedAnimal[];
  owned: Record<AnimalSpeciesId, number>;
  resources: Resources;
  upgrades: IdleGameUpgrades;
  runLifetimeCoins: number;
  stardust: number;
  paused: boolean;
  lastUpdatedAt: number;
  lastMessage: string;
  dayCycleTime: number;
}

interface Animal extends PersistedAnimal {
  vx: number;
  vy: number;
  facingDirection: 1 | -1;
  directionChangeCooldown: number;
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
  sleepTimer: number;
  heartTimer: number;
  snackHeartTimer: number;
  zzzTimer: number;
  wakeBouncePending: boolean;
  definition: AnimalDefinition;
  view: AnimalSpriteView;
  pendingTexts: { text: string; delay: number; value: number }[];
}

interface AnimalSpriteView {
  container: Container;
  sprite: Sprite;
  shadow: Graphics;
}

interface Particle {
  view: Container;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  spin: number;
  baseScale: number;
  fixedScale?: boolean;
  fadeOnly?: boolean;
}

interface Foliage {
  view: Container;
  sprite: Sprite;
  x: number;
  y: number;
  growth: number;
  life: number;
  maxLife: number;
  bounce: number;
  bounceVelocity: number;
  baseScale: number;
}

interface FoodItem {
  view: Container;
  sprite: Sprite;
  shadow: Graphics;
  x: number;
  y: number;
  z: number;
  vz: number;
  life: number;
  maxLife: number;
}

interface IdleGameMount {
  destroy: () => void;
}

interface UIRefs {
  root: HTMLElement;
  stage: HTMLElement;
  population: HTMLElement;
  food: HTMLElement;
  coins: HTMLElement;
  stardust: HTMLElement;
  mood: HTMLElement;
  feedback: HTMLElement;
  feedButton: HTMLButtonElement;
  populateButton: HTMLButtonElement;
  shopButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  shopDrawer: HTMLElement;
  shopClose: HTMLButtonElement;
  shopList: HTMLElement;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "idle-game";
const ROOT_SELECTOR = "[data-idle-game-root]";
const MAX_OFFLINE_MS = 6 * 60 * 60 * 1000;
const FEED_COST = 10;
const FOOD_REGEN_PER_SECOND = 1.45;
const POPULATE_COOLDOWN_MS = 18000;
const STARTING_FOOD = 64;
const STARTING_COINS = 0;
const STARTING_POPULATION = 5;
const BASE_FOOD_CAPACITY = 90;
const BASE_POPULATION_CAP = 20;
// Rendering every owned animal becomes noisy and expensive once idle scaling kicks in.
// Above the aggregation threshold, one larger representative sprite stands in for that species.
const MAX_VISUAL_ANIMALS = 48;
const VISUAL_AGGREGATION_THRESHOLD = 10;
const ANIMAL_COST_GROWTH = 1.15;
const PRESTIGE_UNLOCK_COINS = 1_000_000;
const PRESTIGE_MULTIPLIER_PER_STARDUST = 0.1;
const MANUAL_POWER_SCALING_EXPONENT = 0.35;
const BASE_FEED_HUNGER_GAIN = 0.2;
const FEED_POWER_HUNGER_MULTIPLIER = 0.14;
const BASE_FEED_HAPPINESS_GAIN = 0.12;
const FEED_POWER_HAPPINESS_MULTIPLIER = 0.08;
const AGGREGATE_SCALE_BASE = 10;
const WORLD_WIDTH = 12;
const WORLD_DEPTH = 12;
const WORLD_TILE_COLUMNS = 9;
const WORLD_TILE_ROWS = 9;
const WORLD_PADDING = 0.9;
const BABY_GROWTH_SECONDS = 28;
const HUNGER_DECAY_PER_SECOND = 0.009;
const HAPPINESS_DECAY_PER_SECOND = 0.004;
const HUNGER_NEUTRAL_POINT = 0.58;
const HAPPINESS_HUNGER_COUPLING = 0.2;
const OFFLINE_HAPPINESS_HUNGER_COUPLING = 0.06;
const IDLE_BOB_AMPLITUDE = 9;
const DEFAULT_VIEWPORT_WIDTH = 420;
const DEFAULT_VIEWPORT_HEIGHT = 560;
const VIEWPORT_ANCHOR_Y = 0.5;
const ISOMETRIC_Y_RATIO = 0.72;
const RECOMMENDED_MAX_DPR = 2;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FEEDBACK_LOW_CAP_THRESHOLD = 0.8;
const POPULATION_PRESSURE_MESSAGE = "The meadow is getting cosy — population cap is almost full.";
const DAY_CYCLE_DURATION = 120; // seconds for a full cycle
const SLEEP_CHANCE_PER_SECOND = 0.008;
const SLEEP_DURATION_MIN = 8;
const SLEEP_DURATION_MAX = 18;
const HEART_EMIT_INTERVAL = 2.5;
const ZZZ_EMIT_INTERVAL = 1.8;
const COIN_TICK_INTERVAL = 1.0;
const DIRECTION_CHANGE_COOLDOWN_MIN = 0.45;
const DIRECTION_CHANGE_COOLDOWN_MAX = 0.95;
const DIRECTION_CHANGE_SPEED_THRESHOLD = 0.13;

const RARITY_COLORS: Record<Rarity, number> = {
  common: 0x95a5a6,
  uncommon: 0x2ecc71,
  rare: 0x3498db,
  epic: 0x9b59b6,
  legendary: 0xf39c12,
};

// ---------------------------------------------------------------------------
// Animal definitions with rarity
// ---------------------------------------------------------------------------

const animalDefinitions: AnimalDefinition[] = [
  // Common (weight 6)
  { id: "bunny", label: "Bunny", asset: animalBunny, weight: 6, baseScale: 0.9, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  { id: "chick", label: "Chick", asset: animalChick, weight: 6, baseScale: 0.82, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  { id: "pig", label: "Pig", asset: animalPig, weight: 6, baseScale: 0.92, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  { id: "cat", label: "Cat", asset: animalCat, weight: 5, baseScale: 0.92, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  { id: "dog", label: "Dog", asset: animalDog, weight: 5, baseScale: 0.93, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  { id: "cow", label: "Cow", asset: animalCow, weight: 4, baseScale: 0.95, rarity: "common", shopCost: 0, coinsPerSecond: 0 },
  // Uncommon (weight 3)
  { id: "fox", label: "Fox", asset: animalFox, weight: 3, baseScale: 0.92, rarity: "uncommon", shopCost: 25, coinsPerSecond: 0.3 },
  { id: "deer", label: "Deer", asset: animalDeer, weight: 3, baseScale: 0.94, rarity: "uncommon", shopCost: 25, coinsPerSecond: 0.3 },
  { id: "beaver", label: "Beaver", asset: animalBeaver, weight: 3, baseScale: 0.92, rarity: "uncommon", shopCost: 30, coinsPerSecond: 0.35 },
  { id: "hog", label: "Hog", asset: animalHog, weight: 3, baseScale: 0.9, rarity: "uncommon", shopCost: 25, coinsPerSecond: 0.3 },
  { id: "bee", label: "Bee", asset: animalBee, weight: 2.5, baseScale: 0.8, rarity: "uncommon", shopCost: 20, coinsPerSecond: 0.25 },
  { id: "caterpillar", label: "Caterpillar", asset: animalCaterpillar, weight: 2.5, baseScale: 0.82, rarity: "uncommon", shopCost: 20, coinsPerSecond: 0.25 },
  // Rare (weight 1.5)
  { id: "penguin", label: "Penguin", asset: animalPenguin, weight: 1.5, baseScale: 0.9, rarity: "rare", shopCost: 75, coinsPerSecond: 0.8 },
  { id: "koala", label: "Koala", asset: animalKoala, weight: 1.5, baseScale: 0.88, rarity: "rare", shopCost: 80, coinsPerSecond: 0.85 },
  { id: "monkey", label: "Monkey", asset: animalMonkey, weight: 1.2, baseScale: 0.93, rarity: "rare", shopCost: 85, coinsPerSecond: 0.9 },
  { id: "crab", label: "Crab", asset: animalCrab, weight: 1, baseScale: 0.86, rarity: "rare", shopCost: 70, coinsPerSecond: 0.75 },
  { id: "fish", label: "Fish", asset: animalFish, weight: 1, baseScale: 0.82, rarity: "rare", shopCost: 65, coinsPerSecond: 0.7 },
  { id: "parrot", label: "Parrot", asset: animalParrot, weight: 1, baseScale: 0.86, rarity: "rare", shopCost: 90, coinsPerSecond: 1.0 },
  // Epic (weight 0.4)
  { id: "panda", label: "Panda", asset: animalPanda, weight: 0.4, baseScale: 0.94, rarity: "epic", shopCost: 200, coinsPerSecond: 2.5 },
  { id: "lion", label: "Lion", asset: animalLion, weight: 0.4, baseScale: 0.96, rarity: "epic", shopCost: 220, coinsPerSecond: 2.8 },
  { id: "tiger", label: "Tiger", asset: animalTiger, weight: 0.35, baseScale: 0.95, rarity: "epic", shopCost: 240, coinsPerSecond: 3.0 },
  { id: "polar", label: "Polar Bear", asset: animalPolar, weight: 0.35, baseScale: 0.95, rarity: "epic", shopCost: 250, coinsPerSecond: 3.2 },
  // Legendary (weight 0.1)
  { id: "elephant", label: "Elephant", asset: animalElephant, weight: 0.1, baseScale: 1, rarity: "legendary", shopCost: 500, coinsPerSecond: 8.0 },
  { id: "giraffe", label: "Giraffe", asset: animalGiraffe, weight: 0.1, baseScale: 1.02, rarity: "legendary", shopCost: 600, coinsPerSecond: 10.0 },
];

const animalDefinitionMap = new Map(animalDefinitions.map((d) => [d.id, d]));
const animalSpeciesIds = animalDefinitions.map((d) => d.id);

// ---------------------------------------------------------------------------
// Day/night palette system
// ---------------------------------------------------------------------------

interface DayPalette {
  skyTop: string;
  skyBottom: string;
  tileA: number;
  tileB: number;
  tileStroke: number;
  shadowAlpha: number;
  tileAlpha: number;
}

const dayPalettes: Record<DayCyclePhase, DayPalette> = {
  dawn: {
    skyTop: "#ffe4c4",
    skyBottom: "#ffa07a",
    tileA: 0xfff5e6,
    tileB: 0xffe0c0,
    tileStroke: 0xe8c8a0,
    shadowAlpha: 0.1,
    tileAlpha: 0.18,
  },
  day: {
    skyTop: "#dff6dc",
    skyBottom: "#97c796",
    tileA: 0xffffff,
    tileB: 0xe8f7e5,
    tileStroke: 0xcde7ca,
    shadowAlpha: 0.14,
    tileAlpha: 0.2,
  },
  sunset: {
    skyTop: "#ffb8c6",
    skyBottom: "#c87dab",
    tileA: 0xffe8ef,
    tileB: 0xf0c8d8,
    tileStroke: 0xd4a8b8,
    shadowAlpha: 0.16,
    tileAlpha: 0.18,
  },
  night: {
    skyTop: "#2c3e6b",
    skyBottom: "#1a1a3e",
    tileA: 0x4a5580,
    tileB: 0x3d4870,
    tileStroke: 0x353d60,
    shadowAlpha: 0.22,
    tileAlpha: 0.12,
  },
};

const basePalette = {
  shadow: 0x6a7f71,
  heart: [0xffc0d8, 0xff9ac2, 0xffe0ec],
  sparkle: [0xffef9f, 0xffd56a, 0xfffbdb],
  confetti: [0xc1f0d1, 0xbbd9ff, 0xffd2a1, 0xe4d1ff],
  zzz: [0xc8d8ff, 0xa0b8e8, 0x8898d0],
};

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

// Astro view transitions can call `initIdleGame` repeatedly without a hard reload.
// These module-level guards ensure there is only ever one Pixi app/ticker alive.
let activeGame: IdleGameMount | null = null;
let activeMountToken = 0;
let cleanupRegistered = false;
// Texture loading is shared across mounts; Pixi textures are intentionally not destroyed
// during route cleanup so navigating away/back does not reload the same pixel art assets.
let texturesPromise: Promise<Map<string, Texture>> | null = null;

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

export function initIdleGame(): void {
  const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);
  if (!root) {
    destroyActiveGame();
    return;
  }

  // The token protects against async races: a slower previous mount can finish after
  // a newer route transition, and must destroy itself instead of becoming active.
  const mountToken = ++activeMountToken;
  destroyActiveGame();

  if (!cleanupRegistered) {
    // Astro fires this before preparing the next page. Registering once per active
    // mount prevents duplicate listeners while still tearing down Pixi before DOM swap.
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
      if (feedback) feedback.textContent = "Idle game failed to load. Try refreshing the page.";
    });
}

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------

/**
 * Mounts the Idle Game into the provided container.
 *
 * Sets up a PixiJS application, loads assets, hydrates persisted state,
 * and starts the main ticker loop handling physics, AI, and rendering.
 *
 * @param root - The DOM element acting as the container for the game UI and Canvas.
 * @returns A promise that resolves to an object containing a `destroy` function to tear down the game.
 */
export async function mountIdleGame(root: HTMLElement): Promise<IdleGameMount> {
  const ui = getUIRefs(root);
  const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
  let reducedMotion = reducedMotionMedia.matches;
  const textures = await loadTextures();

  const app = new Application();
  await app.init({
    antialias: true,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgl",
    // Cap DPR because the canvas animates continuously; very high-density screens
    // otherwise pay a large fill-rate cost for pixel art that is intentionally crisp.
    resolution: Math.min(window.devicePixelRatio || 1, RECOMMENDED_MAX_DPR),
    resizeTo: ui.stage,
  });

  ui.stage.replaceChildren(app.canvas);
  app.canvas.className = "idle-game__canvas";
  app.canvas.setAttribute("aria-hidden", "true");

  // Layers are split by behavior rather than just z-order. Background/ground are redrawn,
  // foliage and animals sort by projected Y, and particles can float above both without
  // contaminating the animal display list during cleanup.
  const bgLayer = new Container();
  const worldLayer = new Container();
  const particleLayer = new Container();
  const foliageLayer = new Container();
  const animalLayer = new Container();
  const ground = new Graphics();
  const worldShadow = new Graphics();
  const bgGraphics = new Graphics();

  bgLayer.addChild(bgGraphics);
  worldLayer.sortableChildren = true;
  particleLayer.sortableChildren = true;
  foliageLayer.sortableChildren = true;
  animalLayer.sortableChildren = true;

  worldLayer.addChild(worldShadow);
  worldLayer.addChild(ground);
  worldLayer.addChild(foliageLayer);
  worldLayer.addChild(animalLayer);
  app.stage.addChild(bgLayer);
  app.stage.addChild(worldLayer);
  app.stage.addChild(particleLayer);

  // Runtime state mirrors persistence but keeps transient Pixi-only arrays separate.
  // `state` is the canonical economy/save object; `animals`, `particles`, etc. are render helpers.
  const state = hydrateState();
  syncDerivedCapacities(state);
  let feedbackMessage = state.lastMessage || "A tiny cozy meadow is ready.";
  let saveTimer = 0;
  let coinTimer = 0;
  let destroyed = false;
  let lastTime = performance.now();
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;
  let populationPressureState: "normal" | "warning" = "normal";
  let shopOpen = false;
  const particles: Particle[] = [];
  const foliageList: Foliage[] = [];
  const foodItems: FoodItem[] = [];
  let foliageSpawnTimer = 0;
  const animals = state.animals.map((p) => createAnimal(p, textures));

  /**
   * Projects world-space coordinates using the latest measured viewport.
   *
   * Pixi may tick before a resize measurement has landed, so the fallback sizes
   * keep first render deterministic instead of briefly projecting everything at 0x0.
   */
  const project = (worldX: number, worldY: number, elevation = 0) =>
    projectWithViewport(lastViewportWidth || ui.stage.clientWidth || DEFAULT_VIEWPORT_WIDTH, lastViewportHeight || ui.stage.clientHeight || DEFAULT_VIEWPORT_HEIGHT, worldX, worldY, elevation);

  rebuildGround();
  animals.forEach((a) => animalLayer.addChild(a.view.container));
  reconcileAnimalViews();

  for (let i = 0; i < 110; i++) {
    spawnFoliage(true);
  }

  updateFeedback(feedbackMessage);
  updateHUD();
  renderAnimals(0);
  renderShopList();

  // Canvas taps intentionally only wake sleeping animals. The shop/HUD remain real
  // DOM controls, so the canvas does not need to implement a broader input system.
  app.canvas.addEventListener("pointerdown", handleCanvasTap);

  function handleCanvasTap(event: PointerEvent): void {
    if (state.paused) return;
    const rect = app.canvas.getBoundingClientRect();
    const tapX = event.clientX - rect.left;
    const tapY = event.clientY - rect.top;

    for (const animal of animals) {
      if (!animal.sleeping) continue;
      const screen = project(animal.x, animal.y, 0);
      const dx = tapX - screen.x;
      const dy = tapY - screen.y;
      if (dx * dx + dy * dy < 2000) {
        wakeAnimal(animal);
        break;
      }
    }
  }

  function wakeAnimal(animal: Animal): void {
    animal.sleeping = false;
    animal.wakeBouncePending = true;
    animal.bounceVelocity += reducedMotion ? 4.0 : 12.0;
    animal.turnImpulse = 1;
    animal.happiness = clamp(animal.happiness + 0.12, 0, 1);
    spawnParticleBurst(animal.x, animal.y, "star", reducedMotion ? 2 : 4);
    spawnParticleBurst(animal.x, animal.y, "heart", reducedMotion ? 1 : 2);
    updateFeedback(`${animal.definition.label} woke up with a springy bounce!`);
  }

  function reconcileAnimalViews(): void {
    syncDerivedCapacities(state);

    // `state.owned` may represent hundreds or thousands of animals. Keep only the
    // representative sprites required for readable visuals and rebuild toward that target.
    for (const speciesId of animalSpeciesIds) {
      const speciesAnimals = animals.filter((animal) => animal.species === speciesId);
      const targetVisible = getTargetVisibleCount(speciesId);

      for (let i = speciesAnimals.length - 1; i >= targetVisible; i -= 1) {
        const animal = speciesAnimals[i];
        const index = animals.indexOf(animal);
        if (index >= 0) animals.splice(index, 1);
        animal.view.container.destroy({ children: true });
      }

      for (let i = speciesAnimals.length; i < targetVisible && animals.length < MAX_VISUAL_ANIMALS; i += 1) {
        const animal = createAnimal(createPersistedAnimal(speciesId), textures);
        animals.push(animal);
        animalLayer.addChild(animal.view.container);
      }
    }
  }

  function getTargetVisibleCount(speciesId: AnimalSpeciesId): number {
    const owned = Math.floor(state.owned[speciesId] || 0);
    if (owned <= 0) return 0;
    // One sprite per high-count species keeps rare purchases visible while preventing
    // common species from consuming the whole visual budget.
    const visualCount = owned > VISUAL_AGGREGATION_THRESHOLD ? 1 : owned;
    return Math.min(visualCount, Math.max(0, MAX_VISUAL_ANIMALS - countOtherSpeciesVisuals(speciesId)));
  }

  function countOtherSpeciesVisuals(speciesId: AnimalSpeciesId): number {
    return animals.reduce((total, animal) => total + (animal.species === speciesId ? 0 : 1), 0);
  }

  function getTotalPopulation(): number {
    return sumOwned(state.owned);
  }

  function getPrestigeMultiplier(): number {
    return 1 + state.stardust * PRESTIGE_MULTIPLIER_PER_STARDUST;
  }

  function getTotalCoinsPerSecond(): number {
    // Passive production is based on owned counts, not visible representatives.
    // This is the key invariant that keeps aggregation from changing progression.
    const baseCps = animalDefinitions.reduce((total, def) => total + (state.owned[def.id] || 0) * def.coinsPerSecond, 0);
    return baseCps * getPrestigeMultiplier();
  }

  function getManualPower(): number {
    const capacityPower = Math.max(1, state.resources.foodCapacity / BASE_FOOD_CAPACITY);
    const cpsPower = Math.max(1, getTotalCoinsPerSecond());
    // The fractional curve lets manual actions keep pace with exponential systems without making early clicks jump by entire upgrade tiers.
    return Math.max(1, Math.floor(Math.pow(capacityPower * cpsPower, MANUAL_POWER_SCALING_EXPONENT) * getGoldenRationsMultiplier(state.upgrades.goldenRations)));
  }

  function getMostHatchedSpecies(hatchCounts: Map<AnimalSpeciesId, number>): AnimalSpeciesId | undefined {
    let selectedSpecies: AnimalSpeciesId | undefined;
    let selectedCount = 0;
    hatchCounts.forEach((count, speciesId) => {
      if (count > selectedCount) {
        selectedSpecies = speciesId;
        selectedCount = count;
      }
    });
    return selectedSpecies;
  }

  // Event handlers
  const handleFeed = () => {
    if (state.paused) {
      updateFeedback("Unpause first, then feed.");
      return;
    }
    const feedPower = getManualPower();
    const feedCost = Math.min(state.resources.foodCapacity, FEED_COST * feedPower);
    if (state.resources.food < feedCost) {
      updateFeedback("Not enough food yet — wait for it to refill.");
      return;
    }

    state.resources.food = clamp(state.resources.food - feedCost, 0, state.resources.foodCapacity);
    const feedPoint = { x: randomBetween(-2.2, 2.2), y: randomBetween(-1.8, 1.8) };

    // Food drops are visual feedback first; the actual stat gain is applied below
    // so reduced/aggregated animal counts do not affect the cost-benefit math.
    const foodCount = Math.floor(randomBetween(1, 3.99));
    for (let i = 0; i < foodCount; i++) {
      const asset = foodAssets[Math.floor(randomBetween(0, foodAssets.length))];
      const food = createFoodItem(textures, asset.src);
      food.x = clamp(feedPoint.x + randomBetween(-1.2, 1.2), minX(), maxX());
      food.y = clamp(feedPoint.y + randomBetween(-1.2, 1.2), minY(), maxY());
      food.z = randomBetween(2, 4);
      food.vz = randomBetween(4, 9);
      foodItems.push(food);
      animalLayer.addChild(food.view);
    }

    const awakeAnimals = animals.filter((a) => !a.sleeping);
    const nearbyAnimals = awakeAnimals
      .map((animal) => ({ animal, distance: distanceSq(animal.x, animal.y, feedPoint.x, feedPoint.y) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Math.min(awakeAnimals.length, 7));

    nearbyAnimals.forEach(({ animal }, index) => {
      animal.targetX = clamp(feedPoint.x + randomBetween(-0.6, 0.6), minX(), maxX());
      animal.targetY = clamp(feedPoint.y + randomBetween(-0.6, 0.6), minY(), maxY());
      animal.feedTargetUntil = performance.now() + 3200 + index * 60;
      animal.hunger = clamp(animal.hunger + BASE_FEED_HUNGER_GAIN + Math.log10(1 + feedPower) * FEED_POWER_HUNGER_MULTIPLIER, 0, 1);
      animal.happiness = clamp(animal.happiness + BASE_FEED_HAPPINESS_GAIN + Math.log10(1 + feedPower) * FEED_POWER_HAPPINESS_MULTIPLIER, 0, 1);
      animal.bounceVelocity += reducedMotion ? 2.5 : 6.0;
      animal.turnImpulse = 1;
    });

    spawnParticleBurst(feedPoint.x, feedPoint.y, "heart", reducedMotion ? 5 : 9);
    updateFeedback(`Snack drop x${formatNumber(feedPower)}! ${nearbyAnimals.length} animals waddling over.`);
    persistSoon();
    updateHUD();
  };

  const handlePopulate = () => {
    const now = Date.now();
    if (state.paused) {
      updateFeedback("Unpause first.");
      return;
    }
    const totalPopulation = getTotalPopulation();
    if (totalPopulation >= state.resources.populationCap) {
      updateFeedback("Meadow is full!");
      return;
    }
    if (state.resources.populateCooldownUntil > now) {
      const s = Math.ceil((state.resources.populateCooldownUntil - now) / 1000);
      updateFeedback(`Cooldown: ${s}s`);
      return;
    }

    // Hatching uses visible adults as a lightweight "someone is available" gate,
    // then increments `owned` directly so aggregated herds can still grow correctly.
    const happyAdultRepresentatives = animals.filter((a) => a.growth >= 0.96 && a.happiness >= 0.5 && a.hunger >= 0.4 && !a.sleeping);
    if (totalPopulation < 2 || happyAdultRepresentatives.length < 1) {
      updateFeedback("Need 2+ animals and a happy awake representative to hatch.");
      return;
    }

    const hatchCount = Math.min(state.resources.populationCap - totalPopulation, getManualPower());
    const hatchCounts = new Map<AnimalSpeciesId, number>();
    for (let i = 0; i < hatchCount; i += 1) {
      const species = weightedChoice(animalDefinitions, Math.random);
      hatchCounts.set(species.id, (hatchCounts.get(species.id) || 0) + 1);
      state.owned[species.id] = (state.owned[species.id] || 0) + 1;
    }
    reconcileAnimalViews();
    const featuredSpeciesId = getMostHatchedSpecies(hatchCounts);
    const featuredBaby = featuredSpeciesId ? animals.find((animal) => animal.species === featuredSpeciesId) : undefined;
    happyAdultRepresentatives.slice(0, 2).forEach((a) => {
      a.happiness = clamp(a.happiness - 0.08, 0, 1);
      a.bounceVelocity += reducedMotion ? 2.0 : 4.5;
    });
    state.resources.populateCooldownUntil = now + POPULATE_COOLDOWN_MS;
    if (featuredBaby) {
      spawnParticleBurst(featuredBaby.x, featuredBaby.y, "star", reducedMotion ? 10 : 16);
      spawnParticleBurst(featuredBaby.x, featuredBaby.y, "dot", reducedMotion ? 7 : 10);
    }

    updateFeedback(`${formatNumber(hatchCount)} tiny animals hatched!`);
    persistSoon();
    updateHUD();
  };

  const handleShopToggle = () => {
    shopOpen = !shopOpen;
    ui.shopDrawer.hidden = !shopOpen;
    if (shopOpen) renderShopList();
  };

  const handleShopClose = () => {
    shopOpen = false;
    ui.shopDrawer.hidden = true;
    ui.shopDrawer.style.transform = "";
  };

  const handlePauseToggle = () => {
    state.paused = !state.paused;
    if (state.paused) {
      updateFeedback("Paused.");
    } else {
      lastTime = performance.now();
      updateFeedback("Resumed.");
    }
    updateHUD();
    persistSoon(true);
  };

  const handleVisibilityChange = () => {
    // Stop the ticker while hidden to avoid burning CPU in background tabs. Offline
    // catchup handles longer absences when the state is hydrated again.
    if (document.hidden) app.ticker.stop();
    else {
      lastTime = performance.now();
      app.ticker.start();
    }
  };

  const handleReducedMotionChange = (e: MediaQueryListEvent) => {
    reducedMotion = e.matches;
  };

  ui.feedButton.addEventListener("click", handleFeed);
  ui.populateButton.addEventListener("click", handlePopulate);
  ui.shopButton.addEventListener("click", handleShopToggle);
  ui.shopClose.addEventListener("click", handleShopClose);
  ui.pauseButton.addEventListener("click", handlePauseToggle);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  reducedMotionMedia.addEventListener("change", handleReducedMotionChange);

  // Drag-to-close is implemented on the drawer header only. This avoids fighting
  // native scrolling inside the shop list, which is especially easy to break on touch devices.
  let dragStartY = 0;
  let dragCurrentY = 0;
  let isDraggingDrawer = false;

  ui.shopDrawer.addEventListener("pointerdown", (e) => {
    // Only drag from the header area to not interfere with scrolling the list
    if (!(e.target as HTMLElement).closest(".idle-game__shop-header")) return;
    // Don't drag if clicking the close button
    if ((e.target as HTMLElement).closest("[data-idle-game-shop-close]")) return;

    isDraggingDrawer = true;
    dragStartY = e.clientY;
    dragCurrentY = e.clientY;
    ui.shopDrawer.style.transition = "none";
    ui.shopDrawer.setPointerCapture(e.pointerId);
  });

  ui.shopDrawer.addEventListener("pointermove", (e) => {
    if (!isDraggingDrawer) return;
    dragCurrentY = e.clientY;
    const deltaY = Math.max(0, dragCurrentY - dragStartY); // Only allow dragging down
    ui.shopDrawer.style.transform = `translateY(${deltaY}px)`;
  });

  const handleDragEnd = (e: PointerEvent) => {
    if (!isDraggingDrawer) return;
    isDraggingDrawer = false;
    ui.shopDrawer.releasePointerCapture(e.pointerId);
    ui.shopDrawer.style.transition = "transform 0.2s cubic-bezier(0.2, 0.7, 0.3, 1)";
    const deltaY = Math.max(0, dragCurrentY - dragStartY);
    if (deltaY > 50) {
      handleShopClose();
    } else {
      ui.shopDrawer.style.transform = "";
    }
  };

  ui.shopDrawer.addEventListener("pointerup", handleDragEnd);
  ui.shopDrawer.addEventListener("pointercancel", handleDragEnd);

  // --- Shop ---
  function handleShopBuy(speciesId: AnimalSpeciesId): void {
    const def = animalDefinitionMap.get(speciesId);
    if (!def) return;
    const cost = getAnimalCost(def, state.owned[speciesId] || 0);
    if (state.resources.coins < cost) {
      updateFeedback("Not enough coins!");
      return;
    }
    if (getTotalPopulation() >= state.resources.populationCap) {
      updateFeedback("Meadow is full!");
      return;
    }

    state.resources.coins -= cost;
    state.owned[def.id] = (state.owned[def.id] || 0) + 1;
    reconcileAnimalViews();
    const representative = animals.find((animal) => animal.species === def.id);
    if (representative) {
      spawnParticleBurst(representative.x, representative.y, "star", 16);
      spawnParticleBurst(representative.x, representative.y, "heart", 8);
    }
    updateFeedback(`Bought a ${def.rarity} ${def.label.toLowerCase()}!`);
    persistSoon();
    updateHUD();
    renderShopList();
  }

  function handleUpgradeBuy(upgradeId: keyof IdleGameUpgrades): void {
    const cost = getUpgradeCost(upgradeId, state.upgrades[upgradeId]);
    if (state.resources.coins < cost) {
      updateFeedback("Not enough coins!");
      return;
    }

    state.resources.coins -= cost;
    state.upgrades[upgradeId] += 1;
    syncDerivedCapacities(state);
    updateFeedback(`${getUpgradeLabel(upgradeId)} upgraded to level ${formatNumber(state.upgrades[upgradeId])}.`);
    persistSoon();
    updateHUD();
    renderShopList();
  }

  function handlePrestige(): void {
    if (state.runLifetimeCoins < PRESTIGE_UNLOCK_COINS) {
      updateFeedback(`Prestige unlocks at ${formatNumber(PRESTIGE_UNLOCK_COINS)} run coins.`);
      return;
    }

    const earnedStardust = Math.floor(Math.cbrt(state.runLifetimeCoins / PRESTIGE_UNLOCK_COINS));
    // Prestige must clear both display lists and backing arrays. Leaving old views
    // around is subtle: the state reset looks correct but the old ticker keeps rendering ghosts.
    animalLayer.removeChildren().forEach((child: Container) => child.destroy({ children: true }));
    particleLayer.removeChildren().forEach((child: Container) => child.destroy({ children: true }));
    animals.length = 0;
    foodItems.length = 0;
    particles.length = 0;
    const freshState = createDefaultState();
    state.animals = freshState.animals;
    state.owned = freshState.owned;
    state.resources = freshState.resources;
    state.upgrades = freshState.upgrades;
    state.runLifetimeCoins = 0;
    state.stardust += earnedStardust;
    state.paused = false;
    state.lastMessage = `Prestiged for ${formatNumber(earnedStardust)} Stardust. Passive production is now x${formatNumber(getPrestigeMultiplier())}.`;
    feedbackMessage = state.lastMessage;
    state.dayCycleTime = freshState.dayCycleTime;
    state.animals.forEach((animal) => {
      const visual = createAnimal(animal, textures);
      animals.push(visual);
      animalLayer.addChild(visual.view.container);
    });
    reconcileAnimalViews();
    spawnParticleBurst(0, 0, "star", reducedMotion ? 16 : 28);
    lastTime = performance.now();
    app.ticker.start();
    persistSoon(true);
    updateHUD();
    renderShopList();
  }

  function renderShopList(): void {
    // The shop is rebuilt from canonical state instead of diffed. The list is small,
    // and full regeneration avoids stale disabled states after coins/caps change.
    const buyableSpecies = animalDefinitions.filter((d) => d.shopCost > 0);
    ui.shopList.innerHTML = "";
    const animalSection = createShopSection("Animals", "Costs grow by 15% for every animal you own.");
    ui.shopList.appendChild(animalSection);
    for (const def of buyableSpecies) {
      const owned = state.owned[def.id] || 0;
      const cost = getAnimalCost(def, owned);
      const item = document.createElement("div");
      item.className = "shop-item";

      const img = document.createElement("img");
      img.className = "shop-item__icon";
      img.src = def.asset.src;
      img.alt = def.label;
      item.appendChild(img);

      const info = document.createElement("div");
      info.className = "shop-item__info";

      const nameEl = document.createElement("div");
      nameEl.className = "shop-item__name";
      nameEl.textContent = def.label;
      info.appendChild(nameEl);

      const rarityEl = document.createElement("div");
      rarityEl.className = `shop-item__rarity shop-item__rarity--${def.rarity}`;
      rarityEl.textContent = def.rarity;
      info.appendChild(rarityEl);

      const statsEl = document.createElement("div");
      statsEl.className = "shop-item__stats";
      statsEl.textContent = `Owned: ${formatNumber(owned)} · +${formatNumber(def.coinsPerSecond * getPrestigeMultiplier())}/s coins`;
      info.appendChild(statsEl);

      item.appendChild(info);

      const btn = document.createElement("button");
      btn.className = "shop-item__buy";
      btn.textContent = `✨ ${formatNumber(cost)}`;
      btn.disabled = state.resources.coins < cost || getTotalPopulation() >= state.resources.populationCap;
      btn.addEventListener("click", () => handleShopBuy(def.id));
      item.appendChild(btn);

      animalSection.appendChild(item);
    }

    const upgradeSection = createShopSection("Upgrades", "Permanent for this run. Prestige Stardust survives resets.");
    ui.shopList.appendChild(upgradeSection);
    (["meadowExpansion", "siloStorage", "goldenRations"] as const).forEach((upgradeId) => {
      const level = state.upgrades[upgradeId];
      const cost = getUpgradeCost(upgradeId, level);
      const item = document.createElement("div");
      item.className = "shop-item shop-item--upgrade";

      const icon = document.createElement("div");
      icon.className = "shop-item__emoji";
      icon.textContent = getUpgradeIcon(upgradeId);
      item.appendChild(icon);

      const info = document.createElement("div");
      info.className = "shop-item__info";

      const nameEl = document.createElement("div");
      nameEl.className = "shop-item__name";
      nameEl.textContent = getUpgradeLabel(upgradeId);
      info.appendChild(nameEl);

      const statsEl = document.createElement("div");
      statsEl.className = "shop-item__stats";
      statsEl.textContent = `${getUpgradeDescription(upgradeId, level + 1)} · Level ${formatNumber(level)}`;
      info.appendChild(statsEl);
      item.appendChild(info);

      const btn = document.createElement("button");
      btn.className = "shop-item__buy";
      btn.textContent = `✨ ${formatNumber(cost)}`;
      btn.disabled = state.resources.coins < cost;
      btn.addEventListener("click", () => handleUpgradeBuy(upgradeId));
      item.appendChild(btn);
      upgradeSection.appendChild(item);
    });

    const prestigeSection = createShopSection("Prestige", `Reset this run for Stardust. Each Stardust adds +10% passive production.`);
    ui.shopList.appendChild(prestigeSection);
    const prestigeItem = document.createElement("div");
    prestigeItem.className = "shop-item shop-item--prestige";
    const prestigeIcon = document.createElement("div");
    prestigeIcon.className = "shop-item__emoji";
    prestigeIcon.textContent = "🌠";
    prestigeItem.appendChild(prestigeIcon);
    const prestigeInfo = document.createElement("div");
    prestigeInfo.className = "shop-item__info";
    const prestigeName = document.createElement("div");
    prestigeName.className = "shop-item__name";
    prestigeName.textContent = "Stardust Reset";
    prestigeInfo.appendChild(prestigeName);
    const prestigeStats = document.createElement("div");
    prestigeStats.className = "shop-item__stats";
    const pendingStardust = state.runLifetimeCoins >= PRESTIGE_UNLOCK_COINS ? Math.floor(Math.cbrt(state.runLifetimeCoins / PRESTIGE_UNLOCK_COINS)) : 0;
    prestigeStats.textContent = `Run coins: ${formatNumber(state.runLifetimeCoins)}/${formatNumber(PRESTIGE_UNLOCK_COINS)} · Reward: ${formatNumber(pendingStardust)} Stardust`;
    prestigeInfo.appendChild(prestigeStats);
    prestigeItem.appendChild(prestigeInfo);
    const prestigeButton = document.createElement("button");
    prestigeButton.className = "shop-item__buy";
    prestigeButton.textContent = "Prestige";
    prestigeButton.disabled = state.runLifetimeCoins < PRESTIGE_UNLOCK_COINS;
    prestigeButton.addEventListener("click", handlePrestige);
    prestigeItem.appendChild(prestigeButton);
    prestigeSection.appendChild(prestigeItem);
  }

  function createShopSection(title: string, hint: string): HTMLElement {
    const section = document.createElement("section");
    section.className = "shop-section";
    const heading = document.createElement("h3");
    heading.className = "shop-section__title";
    heading.textContent = title;
    section.appendChild(heading);
    const description = document.createElement("p");
    description.className = "shop-section__hint";
    description.textContent = hint;
    section.appendChild(description);
    return section;
  }

  // --- Main tick ---
  app.ticker.add(() => {
    const now = performance.now();
    // Clamp frame delta so returning from a blocked tab or breakpoint does not launch
    // animals/particles across the meadow in a single catch-up frame.
    const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (destroyed) return;

    if (ui.stage.clientWidth !== lastViewportWidth || ui.stage.clientHeight !== lastViewportHeight) {
      rebuildGround();
      lastViewportWidth = ui.stage.clientWidth;
      lastViewportHeight = ui.stage.clientHeight;
    }

    // Always animate background while paused. Pause freezes economy/animals, not the
    // ambient day/night backdrop, which makes the state feel intentionally paused rather than broken.
    state.dayCycleTime = (state.dayCycleTime + deltaSeconds) % DAY_CYCLE_DURATION;
    renderBackground();

    if (state.paused) return;

    tickResources(deltaSeconds);
    tickCoins(deltaSeconds);
    tickAnimals(deltaSeconds, reducedMotion);
    tickFoliage(deltaSeconds, reducedMotion);
    tickParticles(deltaSeconds, reducedMotion);
    tickFood(deltaSeconds);
    renderAnimals(now * 0.001);
    renderFoliage();
    renderFood();

    saveTimer += deltaSeconds;

    if (saveTimer >= 1.2) {
      saveTimer = 0;
      persistSoon();
    }

    if (Math.random() < 0.1) {
      updateHUD();
    }
  });

  if (document.hidden) app.ticker.stop();

  // --- Tick functions ---

  function tickResources(deltaSeconds: number): void {
    state.resources.food = clamp(state.resources.food + FOOD_REGEN_PER_SECOND * getGoldenRationsMultiplier(state.upgrades.goldenRations) * deltaSeconds, 0, state.resources.foodCapacity);
  }

  function tickCoins(deltaSeconds: number): void {
    coinTimer += deltaSeconds;
    if (coinTimer < COIN_TICK_INTERVAL) return;
    coinTimer -= COIN_TICK_INTERVAL;

    const prestigeMult = getPrestigeMultiplier();
    let totalEarned = 0;

    for (const def of animalDefinitions) {
      const owned = state.owned[def.id] || 0;
      if (owned <= 0) continue;

      const speciesEarned = owned * def.coinsPerSecond * prestigeMult * COIN_TICK_INTERVAL;
      if (speciesEarned <= 0) continue;

      totalEarned += speciesEarned;

      // Floating coin text is distributed across visible representatives. This keeps
      // aggregated species honest visually without tying income to sprite count.
      const visibleSprites = animals.filter((a) => a.species === def.id);
      if (visibleSprites.length > 0) {
        const valPerSprite = speciesEarned / visibleSprites.length;
        if (valPerSprite >= 0.01) {
          const formattedAmount = `+${formatNumber(valPerSprite, false)}`;

          for (const animal of visibleSprites) {
            animal.pendingTexts.push({
              text: formattedAmount,
              delay: randomBetween(0, 1),
              value: valPerSprite,
            });
          }
        }
      }
    }

    state.resources.coins += totalEarned;
    state.runLifetimeCoins += totalEarned;
  }

  /**
   * Advances representative animal simulation for one frame.
   *
   * This deliberately models only the visible sprites. Population/economy use
   * `state.owned`, while these animals provide mood, movement, sleep, and feedback cues.
   *
   * @param deltaSeconds - Clamped elapsed seconds for this animation frame.
   * @param prefersReducedMotion - Whether motion-heavy secondary effects should be softened.
   */
  function tickAnimals(deltaSeconds: number, prefersReducedMotion: boolean): void {
    const nowMs = Date.now();
    const nowPerf = performance.now();

    for (const animal of animals) {
      if (animal.pendingTexts.length > 0) {
        for (let i = animal.pendingTexts.length - 1; i >= 0; i--) {
          animal.pendingTexts[i].delay -= deltaSeconds;
          if (animal.pendingTexts[i].delay <= 0) {
            // Give base font scale 0.8, then add some chunk proportional to the sprite scale,
            // and a bonus based on the magnitude (log10) of the coin value.
            const magnitudeBonus = Math.log10(Math.max(1, animal.pendingTexts[i].value)) * 0.15;
            const fontScale = Math.min(3.0, 0.8 + animal.spriteScale * 0.5 + magnitudeBonus) * 0.4;

            spawnTextParticle(animal.x, animal.y, animal.pendingTexts[i].text, fontScale);
            animal.pendingTexts.splice(i, 1);
          }
        }
      }

      animal.age += deltaSeconds;
      animal.growth = clamp(animal.growth + deltaSeconds / BABY_GROWTH_SECONDS, 0.58, 1);
      animal.hunger = clamp(animal.hunger - HUNGER_DECAY_PER_SECOND * deltaSeconds, 0, 1);
      const happinessDrift = (animal.hunger - HUNGER_NEUTRAL_POINT) * HAPPINESS_HUNGER_COUPLING * deltaSeconds - HAPPINESS_DECAY_PER_SECOND * deltaSeconds;
      animal.happiness = clamp(animal.happiness + happinessDrift, 0, 1);

      // Sleep makes the meadow feel alive but is intentionally non-persistent on offline
      // catchup; otherwise a saved sleeping sprite could wake hours later with stale timers.
      if (animal.sleeping) {
        animal.sleepTimer -= deltaSeconds;
        animal.zzzTimer -= deltaSeconds;
        if (animal.zzzTimer <= 0) {
          animal.zzzTimer = ZZZ_EMIT_INTERVAL + randomBetween(-0.3, 0.3);
          if (!prefersReducedMotion) spawnParticleBurst(animal.x, animal.y - 0.3, "zzz", 1);
        }
        if (animal.sleepTimer <= 0) {
          animal.sleeping = false;
          animal.bounceVelocity += prefersReducedMotion ? 2.5 : 8.0;
        }
        // Sleeping animals don't move, but still apply spring physics for visual
        tickAnimalSpring(animal, deltaSeconds, prefersReducedMotion);
        continue;
      }

      // Chance to fall asleep
      if (animal.growth >= 0.96 && animal.happiness > 0.6 && animal.hunger > 0.5 && Math.random() < SLEEP_CHANCE_PER_SECOND * deltaSeconds) {
        animal.sleeping = true;
        animal.sleepTimer = randomBetween(SLEEP_DURATION_MIN, SLEEP_DURATION_MAX);
        animal.zzzTimer = 0.5;
        animal.vx = 0;
        animal.vy = 0;
      }

      // Heart particles for happy animals
      animal.heartTimer -= deltaSeconds;
      if (animal.heartTimer <= 0 && animal.happiness > 0.75 && !prefersReducedMotion) {
        animal.heartTimer = HEART_EMIT_INTERVAL + randomBetween(-0.5, 0.5);
        spawnParticleBurst(animal.x, animal.y - 0.2, "heart", 1);
      }

      // Wake bounce effect
      if (animal.wakeBouncePending) {
        animal.wakeBouncePending = false;
        animal.bounceVelocity += prefersReducedMotion ? 4.0 : 12.0;
      }

      // Wandering
      animal.wanderCooldown -= deltaSeconds;
      animal.directionChangeCooldown = Math.max(0, animal.directionChangeCooldown - deltaSeconds);
      if (animal.feedTargetUntil <= nowPerf && animal.wanderCooldown <= 0) {
        animal.targetX = clamp(animal.x + randomBetween(-2.8, 2.8), minX(), maxX());
        animal.targetY = clamp(animal.y + randomBetween(-2.6, 2.6), minY(), maxY());
        animal.wanderCooldown = randomBetween(1.2, 3.4);
        animal.bounceVelocity += prefersReducedMotion ? 1.0 : 3.0;
      }

      // Separation is visual only. It keeps sprites from stacking, but should not be
      // interpreted as a collision system for game rules.
      let separationX = 0;
      let separationY = 0;
      for (const other of animals) {
        if (other === animal) continue;
        const dx = animal.x - other.x;
        const dy = animal.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 1.25) {
          const strength = (1.25 - distance) / 1.25;
          separationX += (dx / distance) * strength;
          separationY += (dy / distance) * strength;
        }
      }

      // Movement
      const targetDx = animal.targetX - animal.x;
      const targetDy = animal.targetY - animal.y;
      const targetDistance = Math.hypot(targetDx, targetDy) || 1;

      // Snacking behavior
      const isSnacking = targetDistance < 1.0 && animal.feedTargetUntil > nowPerf;
      if (isSnacking) {
        animal.snackHeartTimer -= deltaSeconds;
        if (animal.snackHeartTimer <= 0) {
          animal.snackHeartTimer = 0.5 + randomBetween(0, 0.4);
          if (!prefersReducedMotion) spawnParticleBurst(animal.x, animal.y - 0.4, "heart", 1);
        }
      } else {
        animal.snackHeartTimer = 0.1; // reset when not snacking so it's ready
      }

      const hungerUrgency = 0.6 + (1 - animal.hunger) * 0.45;
      const maxSpeed = isSnacking ? 0 : animal.feedTargetUntil > nowPerf ? 1.8 : 1.1 + hungerUrgency * 0.8;
      const desiredX = (targetDx / targetDistance) * maxSpeed + separationX * 0.55;
      const desiredY = (targetDy / targetDistance) * maxSpeed + separationY * 0.55;

      const velocityBeforeX = animal.vx;
      const velocityBeforeY = animal.vy;

      animal.vx += (desiredX - animal.vx) * Math.min(5 * deltaSeconds, 1);
      animal.vy += (desiredY - animal.vy) * Math.min(5 * deltaSeconds, 1);
      animal.vx *= 0.92;
      animal.vy *= 0.92;

      animal.x = clamp(animal.x + animal.vx * deltaSeconds, minX(), maxX());
      animal.y = clamp(animal.y + animal.vy * deltaSeconds, minY(), maxY());

      if (animal.x <= minX() || animal.x >= maxX()) animal.vx *= -0.4;
      if (animal.y <= minY() || animal.y >= maxY()) animal.vy *= -0.4;

      const speed = Math.hypot(animal.vx, animal.vy);
      if (speed > DIRECTION_CHANGE_SPEED_THRESHOLD) {
        animal.bounceVelocity += speed * deltaSeconds * (prefersReducedMotion ? 1.5 : 4.0);
      }

      const movingDirection: 1 | -1 = animal.vx >= 0 ? -1 : 1;
      if (speed > DIRECTION_CHANGE_SPEED_THRESHOLD && movingDirection !== animal.facingDirection && animal.directionChangeCooldown <= 0) {
        animal.facingDirection = movingDirection;
        animal.directionChangeCooldown = randomBetween(DIRECTION_CHANGE_COOLDOWN_MIN, DIRECTION_CHANGE_COOLDOWN_MAX);
        animal.turnImpulse = clamp(animal.turnImpulse + (prefersReducedMotion ? 0.42 : 0.95), 0, 1);
        animal.bounceVelocity += prefersReducedMotion ? 1.8 : 6.5;
      }

      const turnDelta = Math.hypot(animal.vx - velocityBeforeX, animal.vy - velocityBeforeY);
      if (turnDelta > 0.08) {
        animal.turnImpulse = clamp(animal.turnImpulse + turnDelta * (prefersReducedMotion ? 0.38 : 0.82), 0, 1);
      }

      tickAnimalSpring(animal, deltaSeconds, prefersReducedMotion);
    }

    updatePopulationPressureFeedback(nowMs);
  }

  function tickAnimalSpring(animal: Animal, deltaSeconds: number, prefersReducedMotion: boolean): void {
    // A tiny spring gives direction changes and wakeups weight without adding a full
    // skeletal animation system for the Kenney sprites.
    const k = prefersReducedMotion ? 40 : 120; // Spring stiffness
    const d = prefersReducedMotion ? 6 : 8; // Damping
    const turnForce = animal.turnImpulse * (prefersReducedMotion ? 6 : 14);

    const springForce = -k * animal.bounce - d * animal.bounceVelocity + turnForce;
    animal.bounceVelocity += springForce * deltaSeconds;
    animal.bounce += animal.bounceVelocity * deltaSeconds;

    animal.turnImpulse *= 1 - Math.min(6 * deltaSeconds, 1);
  }

  /**
   * Advances short-lived particle effects and removes expired Pixi views.
   *
   * Particles own their display objects, so this loop is also the cleanup path that
   * prevents burst-heavy interactions from accumulating invisible children.
   */
  function tickParticles(deltaSeconds: number, prefersReducedMotion: boolean): void {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.life -= deltaSeconds;
      p.x += p.vx * deltaSeconds;
      p.y += p.vy * deltaSeconds;
      p.z += p.vz * deltaSeconds;

      if (!p.fadeOnly) {
        p.vz -= prefersReducedMotion ? 0.6 * deltaSeconds : 1.5 * deltaSeconds;
      }
      p.view.rotation += p.spin * deltaSeconds;

      if (p.life <= 0) {
        p.view.destroy();
        particles.splice(i, 1);
        continue;
      }

      const screen = project(p.x, p.y, p.z);
      // Sort floating effects by their ground contact point. Sorting by elevated Y would
      // make high particles incorrectly pass behind animals as they rise.
      const baseZScreen = project(p.x, p.y, 0);

      const lifeRatio = Math.max(0, p.life / p.maxLife);
      p.view.position.set(screen.x, screen.y);
      // Keep particles fully opaque for most of their life, then fade near the end;
      // otherwise every burst reads as washed out from the moment it spawns.
      p.view.alpha = p.fadeOnly ? Math.min(1, lifeRatio * 1.5) : Math.min(1, lifeRatio * 3.0);
      if (!p.fixedScale) {
        // A small grow-over-time curve makes hearts/stars pop without needing extra frames.
        p.view.scale.set(p.baseScale * Math.min(1.2, 0.6 + (1 - lifeRatio) * 0.7));
      }

      p.view.zIndex = p.fadeOnly ? baseZScreen.y + 20 : screen.y + 400;
    }
  }

  function tickFoliage(deltaSeconds: number, prefersReducedMotion: boolean): void {
    foliageSpawnTimer -= deltaSeconds;
    if (foliageSpawnTimer <= 0) {
      foliageSpawnTimer = randomBetween(0.5, 1.5);
      if (foliageList.length < 120) {
        spawnFoliage();
      }
    }

    for (let i = foliageList.length - 1; i >= 0; i -= 1) {
      const f = foliageList[i];
      f.life -= deltaSeconds;

      if (f.life < 0) {
        f.view.destroy();
        foliageList.splice(i, 1);
        continue;
      }

      if (f.bounce !== 0 || f.bounceVelocity !== 0) {
        const springTension = prefersReducedMotion ? 40.0 : 120.0;
        const springDampening = prefersReducedMotion ? 6.0 : 12.0;

        const springForce = -f.bounce * springTension;
        const dampingForce = -f.bounceVelocity * springDampening;
        const totalForce = springForce + dampingForce;

        f.bounceVelocity += totalForce * deltaSeconds;
        f.bounce += f.bounceVelocity * deltaSeconds;

        if (Math.abs(f.bounceVelocity) < 0.05 && Math.abs(f.bounce) < 0.05) {
          f.bounceVelocity = 0;
          f.bounce = 0;
        }
      }
    }
  }

  /**
   * Projects animal state into Pixi transforms for the current frame.
   *
   * This is intentionally render-only: game rules should mutate state in tick handlers,
   * while this function maps mood, speed, sleep, and aggregation into visual treatment.
   */
  function renderAnimals(time: number): void {
    for (const animal of animals) {
      const isSleeping = animal.sleeping;
      const bobAmp = isSleeping ? 3 : reducedMotion ? 2 : IDLE_BOB_AMPLITUDE;
      const bobFreq = isSleeping ? 0.8 : reducedMotion ? 1.4 : 2;
      const bob = Math.sin(time * bobFreq + animal.bobPhase) * bobAmp;
      const bounce = animal.bounce * (reducedMotion ? 3 : 7);
      const screen = project(animal.x, animal.y, 0);
      const owned = state.owned[animal.species] || 1;
      // Aggregated herds get one larger representative so progress remains visible
      // without turning the meadow into a sprite stress test.
      const aggregateScale = owned > VISUAL_AGGREGATION_THRESHOLD ? Math.log10(AGGREGATE_SCALE_BASE + owned) : 1;
      const scale = animal.spriteScale * animal.growth * aggregateScale;
      const moodTint = isSleeping ? 0xd8d0e8 : applyMoodTint(animal);
      const speed = Math.hypot(animal.vx, animal.vy);
      const stretch = clamp(speed * 0.09 + Math.abs(animal.bounce) * 0.08, 0, reducedMotion ? 0.05 : 0.14);
      const direction = animal.facingDirection;

      // Rarity glow
      if (animal.definition.rarity !== "common" && !isSleeping) {
        animal.view.shadow.tint = RARITY_COLORS[animal.definition.rarity];
      } else {
        animal.view.shadow.tint = 0xffffff;
      }

      animal.view.container.position.set(screen.x, screen.y - bob - bounce);
      animal.view.container.zIndex = screen.y;
      animal.view.sprite.scale.set(direction * scale * (1 + stretch), scale * (1 - stretch * 0.65));
      animal.view.sprite.tint = moodTint;
      animal.view.sprite.alpha = isSleeping ? 0.75 : 1;
      animal.view.shadow.scale.set(scale * 0.85 + stretch * 0.15, scale * 0.55 - stretch * 0.08);
      animal.view.shadow.alpha = clamp(0.18 + animal.growth * 0.08 - Math.abs(bob + bounce) * 0.008, 0.08, 0.3);
    }
  }

  /**
   * Renders decorative foliage from world space into the isometric frame.
   *
   * Foliage is cosmetic and sits just behind animals at the same projected Y, which
   * preserves depth without letting tall grass cover interactive sprites.
   */
  function renderFoliage(): void {
    for (const f of foliageList) {
      let alpha = 1;

      if (f.life < 1.0) {
        alpha = Math.max(0, f.life); // Fade out
      } else if (f.maxLife - f.life < 0.5) {
        alpha = Math.max(0, (f.maxLife - f.life) * 2); // Fade in
      }

      const bounceOffset = f.bounce * (reducedMotion ? 3 : 7);
      const screen = project(f.x, f.y, 0);

      f.view.position.set(screen.x, screen.y - bounceOffset);
      f.view.alpha = alpha;
      f.view.scale.set(f.baseScale);
      f.view.zIndex = screen.y - 1; // Sit slightly behind animals at exact y
    }
  }

  /**
   * Advances thrown food props until they expire.
   *
   * Food exists to communicate a feed action; it does not drive hunger directly, so
   * cleanup can be aggressive without affecting progression.
   */
  function tickFood(deltaSeconds: number): void {
    for (let i = foodItems.length - 1; i >= 0; i--) {
      const f = foodItems[i];
      f.life -= deltaSeconds;
      if (f.life <= 0) {
        f.view.destroy();
        foodItems.splice(i, 1);
        continue;
      }
      f.vz -= 18 * deltaSeconds; // Gravity
      f.z += f.vz * deltaSeconds;
      if (f.z < 0) {
        f.z = 0;
        f.vz *= -0.4; // Bounce dampening
      }
    }
  }

  /**
   * Projects food props and their shadows into the scene.
   *
   * The shadow stays on the ground while the sprite rises/falls, which sells height
   * in a 2D isometric scene without introducing a real 3D camera.
   */
  function renderFood(): void {
    for (const f of foodItems) {
      const bounceOffset = f.z * (reducedMotion ? 3 : 7);
      const screen = project(f.x, f.y, 0);

      f.view.position.set(screen.x, screen.y - bounceOffset);
      f.view.zIndex = screen.y - 1;

      const scale = f.life < 0.3 ? Math.max(0, f.life / 0.3) : 1;
      f.sprite.scale.set(0.9 * scale);

      f.shadow.position.set(0, bounceOffset);
      f.shadow.alpha = clamp(0.18 - f.z * 0.04, 0.05, 0.3);
      f.shadow.scale.set(clamp(1 - f.z * 0.1, 0.5, 1));
    }
  }

  // --- Background ---
  /**
   * Redraws the sky gradient for the current day/night palette.
   *
   * The background is cheap vector work and avoids texture mutation, which keeps the
   * day cycle deterministic across DPR changes and route remounts.
   */
  function renderBackground(): void {
    const w = lastViewportWidth || ui.stage.clientWidth || DEFAULT_VIEWPORT_WIDTH;
    const h = lastViewportHeight || ui.stage.clientHeight || DEFAULT_VIEWPORT_HEIGHT;
    const progress = state.dayCycleTime / DAY_CYCLE_DURATION;
    const pal = interpolateDayPalette(progress);
    const topColor = hexToNumber(pal.skyTop);
    const bottomColor = hexToNumber(pal.skyBottom);
    const gradientBands = 24;

    bgGraphics.clear();

    for (let i = 0; i < gradientBands; i += 1) {
      const t = i / (gradientBands - 1);
      const easedT = Math.pow(t, 1.08);
      const color = lerpHex(topColor, bottomColor, easedT);
      const y = (i / gradientBands) * h;
      const bandHeight = h / gradientBands + 1;
      bgGraphics.rect(0, y, w, bandHeight).fill({ color });
    }
  }

  function rebuildGround(): void {
    const width = ui.stage.clientWidth;
    const height = Math.max(ui.stage.clientHeight, DEFAULT_VIEWPORT_HEIGHT);
    lastViewportWidth = width;
    lastViewportHeight = height;

    ground.clear();
    worldShadow.clear();

    const progress = state.dayCycleTime / DAY_CYCLE_DURATION;
    const pal = interpolateDayPalette(progress);

    const centerX = width * 0.5;
    const centerY = height * VIEWPORT_ANCHOR_Y;
    // Tile size scales with the narrow viewport but is capped so desktop screens do
    // not turn the meadow into oversized diamonds with huge empty edges.
    const isoX = Math.min(width / 16, 42);
    const isoY = isoX * ISOMETRIC_Y_RATIO;

    worldShadow.ellipse(centerX, centerY + isoY * 5.5, isoX * 5.6, isoY * 4.8).fill({
      alpha: pal.shadowAlpha,
      color: basePalette.shadow,
    });

    for (let col = 0; col < WORLD_TILE_COLUMNS; col += 1) {
      for (let row = 0; row < WORLD_TILE_ROWS; row += 1) {
        const worldX = (col - WORLD_TILE_COLUMNS / 2) * 1.45;
        const worldY = (row - WORLD_TILE_ROWS / 2) * 1.45;
        const top = project(worldX, worldY, 0);
        const left = { x: top.x - isoX, y: top.y + isoY };
        const right = { x: top.x + isoX, y: top.y + isoY };
        const bottom = { x: top.x, y: top.y + isoY * 2 };
        const tileColor = (col + row) % 2 === 0 ? pal.tileA : pal.tileB;

        ground
          .moveTo(top.x, top.y)
          .lineTo(right.x, right.y)
          .lineTo(bottom.x, bottom.y)
          .lineTo(left.x, left.y)
          .closePath()
          .fill({ alpha: pal.tileAlpha, color: tileColor })
          .stroke({ alpha: 0.28, color: pal.tileStroke, width: 1 });
      }
    }
  }

  function spawnFoliage(instant = false): void {
    if (foliageAssets.length === 0) return;

    let x = 0;
    let y = 0;
    let valid = false;

    // Generate coordinates framing the outside of the 9x9 diamond floor. Keeping
    // decor outside the playable square avoids obscuring animals and feed effects.
    for (let attempts = 0; attempts < 40; attempts++) {
      const testX = randomBetween(-11, 11);
      const testY = randomBetween(-11, 11);

      // 1. Completely exclude the 'painted squares' in the central play area
      //    (-5.5 to +5.5 space) so animals have a clear, unoccluded stage.
      if (testX > -5.5 && testX < 5.5 && testY > -5.5 && testY < 5.5) {
        continue;
      }

      // 2. Bound the outer limits in a circle (becomes a perfect ellipse when
      //    projected via isometric math) to create a natural, organic frame.
      if (testX * testX + testY * testY > 12.0 * 12.0) {
        continue;
      }

      let tooClose = false;
      for (const f of foliageList) {
        if (distanceSq(testX, testY, f.x, f.y) < 1.0) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        x = testX;
        y = testY;
        valid = true;
        break;
      }
    }

    if (!valid) return;

    const asset = foliageAssets[Math.floor(Math.random() * foliageAssets.length)];
    const texture = textures.get(asset.src);
    if (!texture) return;

    const sprite = new Sprite(texture);
    // Counteract intrinsic empty padding at the bottom of the tall 512x512 foliage assets.
    // Moving the anchor up to 0.60 visually "sinks" the blank space into the ground.
    sprite.anchor.set(0.5, 0.6);

    const container = new Container();
    container.addChild(sprite);

    const life = randomBetween(120, 240);
    const maxLife = instant ? life : life + 0.5;

    // Randomly flip horizontally (1 or -1) to double visual variety from the small
    // asset pool without polluting standard size scaling on the outer container.
    const flip = Math.random() > 0.5 ? 1 : -1;
    const baseScale = randomBetween(0.8, 1.2);
    // Setting `sprite.scale.x` here, and preserving it when container scale changes
    sprite.scale.x = flip;

    const f: Foliage = {
      view: container,
      sprite,
      x,
      y,
      growth: 1,
      life,
      maxLife,
      bounce: 0,
      bounceVelocity: instant ? 0 : reducedMotion ? 4 : 12,
      baseScale,
    };

    foliageLayer.addChild(f.view);
    foliageList.push(f);
  }

  function spawnParticleBurst(worldX: number, worldY: number, kind: ParticleKind, count: number): void {
    for (let i = 0; i < count; i += 1) {
      let view: Container;
      const color = pickParticleColor(kind);
      const size = kind === "zzz" ? 6 + Math.random() * 4 : 4 + Math.random() * 6;
      let baseScale = 1;

      if (kind === "heart" || kind === "star") {
        const texture = textures.get(kind)!;
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.tint = color;
        // The source symbol sprites are grey masks; additive blending keeps tinted
        // hearts/stars readable against both day and night palettes.
        sprite.blendMode = "add";
        // Source symbols are larger than the old vector particles, so normalize them
        // here instead of baking assumptions into every caller's `count`/`size` values.
        baseScale = size / 60;
        view = sprite;
      } else {
        const graphic = new Graphics();
        drawParticleShape(graphic, kind, color, size);
        view = graphic;
      }

      const isZzz = kind === "zzz";
      const particle: Particle = {
        view,
        x: worldX + randomBetween(-0.4, 0.4),
        y: worldY + randomBetween(-0.4, 0.4),
        z: Math.random() * (isZzz ? 10 : 18),
        vx: isZzz ? randomBetween(-0.15, 0.15) : randomBetween(-0.6, 0.6),
        vy: isZzz ? randomBetween(-0.05, 0.05) : randomBetween(-0.6, 0.6),
        vz: isZzz ? randomBetween(0.3, 0.6) : randomBetween(0.6, 1.2),
        life: isZzz ? randomBetween(1.0, 1.6) : randomBetween(0.7, 1.3),
        maxLife: isZzz ? 1.6 : 1.4,
        spin: isZzz ? randomBetween(-0.3, 0.3) : randomBetween(-1.6, 1.6),
        baseScale,
      };
      particleLayer.addChild(view);
      particles.push(particle);
    }
  }

  function spawnTextParticle(worldX: number, worldY: number, textString: string, scale: number = 1): void {
    const text = new Text({
      text: textString,
      style: {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        fontWeight: "bold",
        fill: 0xffd700,
        dropShadow: {
          alpha: 0.8,
          angle: Math.PI / 4,
          blur: 2,
          color: 0x000000,
          distance: 2,
        },
      },
    });

    text.anchor.set(0.5);
    text.scale.set(scale);

    const particle: Particle = {
      view: text,
      x: worldX,
      y: worldY,
      z: 15,
      vx: randomBetween(-0.06, 0.06),
      vy: randomBetween(-0.06, 0.06),
      vz: randomBetween(6.5, 9.0),
      life: 1.2,
      maxLife: 1.2,
      spin: 0,
      baseScale: scale,
      fixedScale: true,
      fadeOnly: true,
    };

    animalLayer.addChild(text);
    particles.push(particle);
  }

  // --- HUD ---
  function updateHUD(): void {
    const totalPopulation = getTotalPopulation();
    const populationPressure = totalPopulation / state.resources.populationCap;
    // Mood reflects visible representatives rather than all owned animals. That makes
    // it a readable care signal for the current scene, while economy still uses `owned`.
    const averageMood = animals.length === 0 ? 0 : animals.reduce((s, a) => s + a.happiness, 0) / animals.length;

    const popEl = ui.population.querySelector("b");
    const foodEl = ui.food.querySelector("b");
    const coinsEl = ui.coins.querySelector("b");
    const stardustEl = ui.stardust.querySelector("b");
    const moodEl = ui.mood.querySelector("b");

    if (popEl) popEl.textContent = `${formatNumber(totalPopulation)}/${formatNumber(state.resources.populationCap)}`;
    if (foodEl) foodEl.textContent = `${formatNumber(Math.floor(state.resources.food))}/${formatNumber(state.resources.foodCapacity)}`;
    if (coinsEl) coinsEl.textContent = `${formatNumber(Math.floor(state.resources.coins))}`;
    if (stardustEl) stardustEl.textContent = `${formatNumber(state.stardust)}`;
    if (moodEl) moodEl.textContent = `${Math.round(averageMood * 100)}%`;

    ui.feedback.textContent = feedbackMessage;
    ui.pauseButton.textContent = state.paused ? "▶ Play" : "⏸ Pause";
    ui.feedButton.disabled = state.resources.food < Math.min(state.resources.foodCapacity, FEED_COST * getManualPower());
    ui.populateButton.disabled = state.paused || totalPopulation >= state.resources.populationCap || state.resources.populateCooldownUntil > Date.now();
    ui.root.dataset.populationPressure = populationPressure >= 1 ? "full" : populationPressure >= FEEDBACK_LOW_CAP_THRESHOLD ? "warning" : "normal";
  }

  function updateFeedback(message: string): void {
    feedbackMessage = message;
    ui.feedback.textContent = message;
  }

  function updatePopulationPressureFeedback(nowMs: number): void {
    const isWarning = nowMs > state.resources.populateCooldownUntil && getTotalPopulation() / state.resources.populationCap >= FEEDBACK_LOW_CAP_THRESHOLD;
    const nextState = isWarning ? "warning" : "normal";
    if (nextState === populationPressureState) return;
    populationPressureState = nextState;
    if (nextState === "warning") updateFeedback(POPULATION_PRESSURE_MESSAGE);
  }

  function persistSoon(force = false): void {
    state.lastMessage = feedbackMessage;
    state.lastUpdatedAt = Date.now();
    if (force || !destroyed) {
      // Persist only serializable gameplay state. Pixi objects, timers, velocities,
      // and pending text particles are transient and reconstructed on hydrate.
      persistState({
        animals: animals.map((a) => ({
          id: a.id,
          species: a.species,
          x: a.x,
          y: a.y,
          age: a.age,
          growth: a.growth,
          hunger: a.hunger,
          happiness: a.happiness,
          sleeping: a.sleeping,
        })),
        owned: state.owned,
        resources: state.resources,
        upgrades: state.upgrades,
        runLifetimeCoins: state.runLifetimeCoins,
        stardust: state.stardust,
        paused: state.paused,
        lastUpdatedAt: state.lastUpdatedAt,
        lastMessage: state.lastMessage,
        dayCycleTime: state.dayCycleTime,
      });
    }
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    persistSoon(true);
    // Listener cleanup must mirror setup exactly. The route can remount via Astro
    // transitions, and duplicate listeners are otherwise hard to spot until inputs fire twice.
    app.canvas.removeEventListener("pointerdown", handleCanvasTap);
    ui.feedButton.removeEventListener("click", handleFeed);
    ui.populateButton.removeEventListener("click", handlePopulate);
    ui.shopButton.removeEventListener("click", handleShopToggle);
    ui.shopClose.removeEventListener("click", handleShopClose);
    ui.pauseButton.removeEventListener("click", handlePauseToggle);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionMedia.removeEventListener("change", handleReducedMotionChange);
    app.ticker.stop();
    particleLayer.removeChildren().forEach((c: Container) => c.destroy());
    foliageLayer.removeChildren().forEach((c: Container) => c.destroy());
    animalLayer.removeChildren().forEach((c: Container) => c.destroy());

    // Keep cached textures alive between route visits; destroying sources here would
    // invalidate the shared `texturesPromise` and make future mounts reuse dead textures.
    app.destroy(true, { children: true, texture: false, textureSource: false });
    ui.stage.replaceChildren();
  }

  return { destroy };
}

// ---------------------------------------------------------------------------
// Module helpers
// ---------------------------------------------------------------------------

function destroyActiveGame(): void {
  activeGame?.destroy();
  activeGame = null;
}

function getUIRefs(root: HTMLElement): UIRefs {
  const stage = root.querySelector<HTMLElement>("[data-idle-game-stage]");
  const population = root.querySelector<HTMLElement>("[data-idle-game-population]");
  const food = root.querySelector<HTMLElement>("[data-idle-game-food]");
  const coins = root.querySelector<HTMLElement>("[data-idle-game-coins]");
  const stardust = root.querySelector<HTMLElement>("[data-idle-game-stardust]");
  const mood = root.querySelector<HTMLElement>("[data-idle-game-mood]");
  const feedback = root.querySelector<HTMLElement>("[data-idle-game-feedback]");
  const feedButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='feed']");
  const populateButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='populate']");
  const shopButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='shop']");
  const pauseButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='pause']");
  const shopDrawer = root.querySelector<HTMLElement>("[data-idle-game-shop]");
  const shopClose = root.querySelector<HTMLButtonElement>("[data-idle-game-shop-close]");
  const shopList = root.querySelector<HTMLElement>("[data-idle-game-shop-list]");

  // Fail fast if the Astro template changes its data-attribute contract. A missing
  // mount point is easier to debug here than as a half-mounted Pixi scene later.
  if (!stage || !population || !food || !coins || !stardust || !mood || !feedback || !feedButton || !populateButton || !shopButton || !pauseButton || !shopDrawer || !shopClose || !shopList) {
    throw new Error("Idle game mount points are missing.");
  }

  return { root, stage, population, food, coins, stardust, mood, feedback, feedButton, populateButton, shopButton, pauseButton, shopDrawer, shopClose, shopList };
}

/**
 * Loads and caches every texture needed by the experiment.
 *
 * Texture keys intentionally mix species ids, symbol ids, and asset `src` values
 * because different callers start from different domain objects. The shared cache
 * keeps Astro remounts cheap while `nearest` preserves the pixel-art look.
 */
async function loadTextures(): Promise<Map<string, Texture>> {
  if (!texturesPromise) {
    const symbols = [
      { id: "heart", asset: particleHeart as ImageAsset },
      { id: "star", asset: particleStar as ImageAsset },
    ];
    texturesPromise = Promise.all([
      ...animalDefinitions.map(async (d) => {
        const texture = await Assets.load(d.asset.src);
        texture.source.scaleMode = "nearest";
        return [d.id, texture] as const;
      }),
      ...symbols.map(async (s) => {
        const texture = await Assets.load(s.asset.src);
        texture.source.scaleMode = "nearest";
        return [s.id, texture] as const;
      }),
      ...foliageAssets.map(async (asset) => {
        const texture = await Assets.load(asset.src);
        texture.source.scaleMode = "nearest";
        return [asset.src, texture] as const;
      }),
      ...foodAssets.map(async (asset) => {
        const texture = await Assets.load(asset.src);
        texture.source.scaleMode = "nearest";
        return [asset.src, texture] as const;
      }),
    ]).then((entries) => new Map<string, Texture>(entries));
  }
  return texturesPromise;
}

// ---------------------------------------------------------------------------
// State persistence
// ---------------------------------------------------------------------------

/**
 * Hydrates game state from `localStorage` or generates the starting state.
 *
 * Attempts to parse, validate, and simulate offline progression.
 * Returns the default initial state if persistence is missing or unparseable.
 *
 * @returns The structured application state
 */
function hydrateState(): IdleGameState {
  if (typeof localStorage === "undefined") return createDefaultState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultState();
  try {
    const parsed = JSON.parse(raw);
    const validated = validateState(parsed);
    if (!validated) return createDefaultState();
    return applyOfflineCatchup(validated);
  } catch {
    return createDefaultState();
  }
}

/**
 * Writes the active state to the `localStorage` key assigned for offline progression.
 *
 * @param state - Current idle game state tree
 */
function persistState(state: IdleGameState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createDefaultState(): IdleGameState {
  const owned = createEmptyOwnedRecord();
  // Starter species are generated from seeded randomness so the opening mix feels
  // varied but remains reproducible enough for debugging default-state issues.
  const animals = Array.from({ length: STARTING_POPULATION }, (_, i) => {
    const species = weightedChoice(
      animalDefinitions.filter((d) => d.rarity === "common"),
      seededRandom(`starter-${i}`),
    );
    owned[species.id] += 1;
    return {
      id: createAnimalId(),
      species: species.id,
      x: randomBetween(-3.8, 3.8),
      y: randomBetween(-3.4, 3.4),
      age: randomBetween(6, 18),
      growth: 1,
      hunger: randomBetween(0.62, 0.94),
      happiness: randomBetween(0.56, 0.9),
      sleeping: false,
    } satisfies PersistedAnimal;
  });

  return {
    animals,
    owned,
    resources: { food: STARTING_FOOD, foodCapacity: BASE_FOOD_CAPACITY, coins: STARTING_COINS, populationCap: BASE_POPULATION_CAP, populateCooldownUntil: 0 },
    upgrades: createDefaultUpgrades(),
    runLifetimeCoins: 0,
    stardust: 0,
    paused: false,
    lastUpdatedAt: Date.now(),
    lastMessage: "A fresh pastel meadow has bloomed.",
    dayCycleTime: 30,
  };
}

/**
 * Advances game state to simulate elapsed time away from the active browser window.
 * Calculates hunger, happiness, day/night cycles, and resources based on constraints.
 *
 * @param state - The loaded, previously persisted idle game state
 * @returns The modified state aligned to `now()` timeframe
 */
function applyOfflineCatchup(state: IdleGameState): IdleGameState {
  const now = Date.now();
  // Cap offline simulation to avoid a forgotten tab or old save file detonating the
  // economy/mood model after months away. Long absences still progress, just bounded.
  const elapsedMs = clamp(now - state.lastUpdatedAt, 0, MAX_OFFLINE_MS);
  const elapsedSeconds = elapsedMs / 1000;

  const animals = state.animals.map((a) => {
    return {
      ...a,
      sleeping: false,
      age: a.age + elapsedSeconds,
      growth: clamp(a.growth + elapsedSeconds / BABY_GROWTH_SECONDS, 0.58, 1),
      hunger: clamp(a.hunger - HUNGER_DECAY_PER_SECOND * elapsedSeconds, 0, 1),
      happiness: clamp(a.happiness + (a.hunger - HUNGER_NEUTRAL_POINT) * OFFLINE_HAPPINESS_HUNGER_COUPLING * elapsedSeconds - HAPPINESS_DECAY_PER_SECOND * elapsedSeconds, 0, 1),
    };
  });

  return {
    ...state,
    animals,
    resources: {
      ...state.resources,
      populateCooldownUntil: Math.max(0, state.resources.populateCooldownUntil - elapsedMs),
    },
    dayCycleTime: ((state.dayCycleTime || 0) + elapsedSeconds) % DAY_CYCLE_DURATION,
    lastUpdatedAt: now,
  };
}

function validateState(input: unknown): IdleGameState | null {
  if (!input || typeof input !== "object") return null;
  const c = input as Partial<IdleGameState>;
  if (!Array.isArray(c.animals) || !c.resources || typeof c.resources !== "object") return null;

  // Trust localStorage enough to salvage valid pieces, but never enough to let
  // arbitrary counts/coordinates leak into the simulation after schema changes.
  const validatedAnimals = c.animals
    .map((a) => validateAnimal(a))
    .filter((a): a is PersistedAnimal => Boolean(a))
    .slice(0, MAX_VISUAL_ANIMALS);
  const resources = c.resources as Partial<Resources>;
  if (!hasValidResourceShape(resources)) return null;
  const upgrades = validateUpgrades(c.upgrades);
  const defaultState = createDefaultState();
  const animals = validatedAnimals.length > 0 ? validatedAnimals : defaultState.animals;
  const owned = validateOwnedRecord(c.owned, animals);
  const state: IdleGameState = {
    animals,
    owned,
    resources: {
      food: getFiniteNumber(resources.food, STARTING_FOOD, 0),
      foodCapacity: getFiniteNumber(resources.foodCapacity, BASE_FOOD_CAPACITY, BASE_FOOD_CAPACITY),
      coins: getFiniteNumber(resources.coins, STARTING_COINS, 0),
      populationCap: getFiniteNumber(resources.populationCap, BASE_POPULATION_CAP, BASE_POPULATION_CAP),
      populateCooldownUntil: getFiniteNumber(resources.populateCooldownUntil, 0, 0),
    },
    upgrades,
    runLifetimeCoins: getFiniteNumber(c.runLifetimeCoins, getFiniteNumber((c as { totalLifetimeCoins?: unknown }).totalLifetimeCoins, 0), 0),
    stardust: getFiniteNumber(c.stardust, 0, 0),
    paused: Boolean(c.paused),
    lastUpdatedAt: getFiniteNumber(c.lastUpdatedAt, Date.now()),
    lastMessage: typeof c.lastMessage === "string" ? c.lastMessage : "Welcome back to the meadow.",
    dayCycleTime: getFiniteNumber(c.dayCycleTime, 30) % DAY_CYCLE_DURATION,
  };

  syncDerivedCapacities(state);
  state.resources.food = clamp(state.resources.food, 0, state.resources.foodCapacity);
  return state;
}

function validateAnimal(input: unknown): PersistedAnimal | null {
  if (!input || typeof input !== "object") return null;
  const c = input as Partial<PersistedAnimal>;
  if (
    typeof c.id !== "string" ||
    !animalDefinitionMap.has(c.species as AnimalSpeciesId) ||
    !Number.isFinite(c.x) ||
    !Number.isFinite(c.y) ||
    !Number.isFinite(c.age) ||
    !Number.isFinite(c.growth) ||
    !Number.isFinite(c.hunger) ||
    !Number.isFinite(c.happiness)
  )
    return null;

  return {
    id: c.id,
    species: c.species as AnimalSpeciesId,
    x: clamp(getFiniteNumber(c.x, 0), -WORLD_WIDTH / 2, WORLD_WIDTH / 2),
    y: clamp(getFiniteNumber(c.y, 0), -WORLD_DEPTH / 2, WORLD_DEPTH / 2),
    age: getFiniteNumber(c.age, 0, 0),
    growth: clamp(getFiniteNumber(c.growth, 1), 0.58, 1),
    hunger: clamp(getFiniteNumber(c.hunger, 0.8), 0, 1),
    happiness: clamp(getFiniteNumber(c.happiness, 0.8), 0, 1),
    sleeping: Boolean(c.sleeping),
  };
}

function hasValidResourceShape(r: Partial<Resources>): r is Resources {
  return typeof r.food === "number" && typeof r.foodCapacity === "number" && typeof r.populationCap === "number" && typeof r.populateCooldownUntil === "number";
}

function createDefaultUpgrades(): IdleGameUpgrades {
  return { meadowExpansion: 0, siloStorage: 0, goldenRations: 0 };
}

function getFiniteNumber(value: unknown, fallback: number, min = Number.NEGATIVE_INFINITY): number {
  const numericValue = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(min, numericValue);
}

function getFiniteInteger(value: unknown, fallback: number, min = Number.NEGATIVE_INFINITY): number {
  return Math.floor(getFiniteNumber(value, fallback, min));
}

function validateUpgrades(input: unknown): IdleGameUpgrades {
  if (!input || typeof input !== "object") return createDefaultUpgrades();
  const c = input as Partial<IdleGameUpgrades>;
  return {
    meadowExpansion: getFiniteInteger(c.meadowExpansion, 0, 0),
    siloStorage: getFiniteInteger(c.siloStorage, 0, 0),
    goldenRations: getFiniteInteger(c.goldenRations, 0, 0),
  };
}

function createEmptyOwnedRecord(): Record<AnimalSpeciesId, number> {
  return animalSpeciesIds.reduce(
    (record, speciesId) => {
      record[speciesId] = 0;
      return record;
    },
    {} as Record<AnimalSpeciesId, number>,
  );
}

function validateOwnedRecord(input: unknown, fallbackAnimals: PersistedAnimal[]): Record<AnimalSpeciesId, number> {
  const owned = createEmptyOwnedRecord();
  if (input && typeof input === "object") {
    const record = input as Partial<Record<AnimalSpeciesId, number>>;
    animalSpeciesIds.forEach((speciesId) => {
      owned[speciesId] = getFiniteInteger(record[speciesId], 0, 0);
    });
  }

  if (sumOwned(owned) === 0) {
    // Older saves may only have representative animals. Reconstruct a minimum owned
    // record from those sprites so the player does not reopen to an empty economy.
    fallbackAnimals.forEach((animal) => {
      owned[animal.species] += 1;
    });
  }

  return owned;
}

function syncDerivedCapacities(state: IdleGameState): void {
  // Capacity fields are stored for quick UI/persistence inspection, but upgrades are
  // authoritative. Re-sync after hydrate/buy paths so stale saves cannot preserve old caps.
  state.resources.populationCap = getPopulationCap(state.upgrades.meadowExpansion);
  state.resources.foodCapacity = getFoodCapacity(state.upgrades.siloStorage);
  state.resources.food = clamp(state.resources.food, 0, state.resources.foodCapacity);
}

function getPopulationCap(level: number): number {
  return Math.floor(BASE_POPULATION_CAP * Math.pow(1.75, level));
}

function getFoodCapacity(level: number): number {
  return Math.floor(BASE_FOOD_CAPACITY * Math.pow(1.8, level));
}

function getAnimalCost(definition: AnimalDefinition, owned: number): number {
  return Math.ceil(definition.shopCost * Math.pow(ANIMAL_COST_GROWTH, owned));
}

function getUpgradeCost(upgradeId: keyof IdleGameUpgrades, level: number): number {
  const baseCosts: Record<keyof IdleGameUpgrades, number> = {
    meadowExpansion: 120,
    siloStorage: 90,
    goldenRations: 150,
  };
  return Math.ceil(baseCosts[upgradeId] * Math.pow(1.65, level));
}

function getGoldenRationsMultiplier(level: number): number {
  return Math.pow(1.45, level);
}

function getUpgradeLabel(upgradeId: keyof IdleGameUpgrades): string {
  const labels: Record<keyof IdleGameUpgrades, string> = {
    meadowExpansion: "Meadow Expansion",
    siloStorage: "Silo Storage",
    goldenRations: "Golden Rations",
  };
  return labels[upgradeId];
}

function getUpgradeIcon(upgradeId: keyof IdleGameUpgrades): string {
  const icons: Record<keyof IdleGameUpgrades, string> = {
    meadowExpansion: "🌄",
    siloStorage: "🏺",
    goldenRations: "🍯",
  };
  return icons[upgradeId];
}

function getUpgradeDescription(upgradeId: keyof IdleGameUpgrades, nextLevel: number): string {
  const descriptions: Record<keyof IdleGameUpgrades, string> = {
    meadowExpansion: `Population cap: ${formatNumber(getPopulationCap(nextLevel))} next`,
    siloStorage: `Food cap: ${formatNumber(getFoodCapacity(nextLevel))} next`,
    goldenRations: `Manual and food regen multiplier: x${formatNumber(getGoldenRationsMultiplier(nextLevel))} next`,
  };
  return descriptions[upgradeId];
}

function sumOwned(owned: Record<AnimalSpeciesId, number>): number {
  return animalSpeciesIds.reduce((total, speciesId) => total + (owned[speciesId] || 0), 0);
}

function createPersistedAnimal(species: AnimalSpeciesId): PersistedAnimal {
  // New representatives start near the center so newly purchased/hatched species are
  // immediately visible instead of appearing at the edge of the decorative frame.
  return {
    id: createAnimalId(),
    species,
    x: clamp(randomBetween(-1.4, 1.4), minX(), maxX()),
    y: clamp(randomBetween(-1.1, 1.1), minY(), maxY()),
    age: 0,
    growth: 0.58,
    hunger: 0.84,
    happiness: 0.82,
    sleeping: false,
  };
}

// ---------------------------------------------------------------------------
// Animal creation
// ---------------------------------------------------------------------------

function createAnimal(persisted: PersistedAnimal, textures: Map<string, Texture>): Animal {
  const definition = animalDefinitionMap.get(persisted.species);
  const texture = textures.get(persisted.species);
  if (!definition || !texture) throw new Error(`Missing definition or texture for ${persisted.species}`);

  const view = createAnimalSprite(texture);
  // Derive bob/scale from the stable id so remounting a save does not make every
  // animal subtly change size or phase, which would look like state corruption.
  const bobPhase = hashToUnit(`${persisted.id}:bob`) * Math.PI * 2;
  const scaleJitter = 0.92 + hashToUnit(`${persisted.id}:scale`) * 0.16;

  return {
    ...persisted,
    vx: 0,
    vy: 0,
    facingDirection: Math.random() < 0.5 ? -1 : 1,
    directionChangeCooldown: randomBetween(0.15, 0.65),
    targetX: clamp(persisted.x + randomBetween(-2, 2), minX(), maxX()),
    targetY: clamp(persisted.y + randomBetween(-2, 2), minY(), maxY()),
    wanderCooldown: randomBetween(0.1, 2.2),
    feedTargetUntil: 0,
    bounce: 0,
    bounceVelocity: 0,
    bobPhase,
    scaleJitter,
    turnImpulse: 0,
    spriteScale: definition.baseScale * scaleJitter,
    sleepTimer: 0,
    heartTimer: randomBetween(0, HEART_EMIT_INTERVAL),
    snackHeartTimer: 0,
    zzzTimer: 0,
    wakeBouncePending: false,
    definition,
    view,
    pendingTexts: [],
  };
}

/**
 * Creates the Pixi display objects for an animal sprite and its ground shadow.
 *
 * The sprite anchor sits at the feet so projection coordinates can represent ground
 * contact. That keeps z-sorting and shadows stable while the sprite bobs above it.
 */
function createAnimalSprite(texture: Texture): AnimalSpriteView {
  const container = new Container();
  const shadow = new Graphics();
  const sprite = new Sprite(texture);

  sprite.anchor.set(0.5, 1);
  sprite.position.set(0, 0);

  shadow.ellipse(0, -6, 28, 16).fill({ alpha: 0.18, color: basePalette.shadow });
  shadow.position.set(0, 0);

  container.addChild(shadow);
  container.addChild(sprite);

  return { container, sprite, shadow };
}

/**
 * Creates a short-lived food prop with its own shadow and vertical physics state.
 *
 * Food props are intentionally independent from hunger calculations: they are a
 * tactile animation layer for feed actions, not the source of truth for animal stats.
 */
function createFoodItem(textures: Map<string, Texture>, assetSrc: string): FoodItem {
  const container = new Container();
  const texture = textures.get(assetSrc);
  if (!texture) throw new Error(`Missing food texture: \${assetSrc}`);

  const shadow = new Graphics();
  shadow.ellipse(0, -2, 12, 6).fill({ alpha: 0.18, color: basePalette.shadow });

  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5, 1);
  sprite.scale.set(0.9);

  container.addChild(shadow);
  container.addChild(sprite);

  return {
    view: container,
    sprite,
    shadow,
    x: 0,
    y: 0,
    z: 0,
    vz: 0,
    life: 3.5,
    maxLife: 3.5,
  };
}

function applyMoodTint(animal: Animal): number {
  // Happiness carries most of the tint because it changes slower than hunger; hunger
  // still contributes enough that neglected animals visibly warm/desaturate.
  const mood = animal.happiness * 0.6 + animal.hunger * 0.4;
  if (mood > 0.82) return 0xffffff;
  if (mood > 0.52) return 0xf7f2ff;
  return 0xf6e3d4;
}

// ---------------------------------------------------------------------------
// Projection
// ---------------------------------------------------------------------------

/**
 * Maps a 3D isometric world unit to a 2D screen coordinate.
 *
 * The projection intentionally has no inverse because all game rules operate in
 * world space. Pointer interactions compare screen-space distances only after projecting.
 *
 * @param width - The current container width.
 * @param height - The current container height.
 * @param worldX - X position inside the isometric space.
 * @param worldY - Y position inside the isometric space.
 * @param elevation - Z height off the ground (0 based).
 * @returns 2D window coordinate.
 */
function projectWithViewport(width: number, height: number, worldX: number, worldY: number, elevation = 0): { x: number; y: number } {
  const isoX = Math.min(width / 16, 42);
  const isoY = isoX * ISOMETRIC_Y_RATIO;
  return {
    x: width * 0.5 + (worldX - worldY) * isoX,
    y: height * VIEWPORT_ANCHOR_Y + (worldX + worldY) * isoY - elevation,
  };
}

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------

function drawParticleShape(graphic: Graphics, kind: ParticleKind, color: number, size: number): void {
  graphic.clear();

  if (kind === "zzz") {
    // Draw a tiny custom "Z" instead of loading another texture; this keeps sleep
    // particles lightweight and readable at multiple sizes.
    graphic
      .moveTo(-size * 0.4, -size * 0.4)
      .lineTo(size * 0.4, -size * 0.4)
      .lineTo(-size * 0.4, size * 0.4)
      .lineTo(size * 0.4, size * 0.4)
      .stroke({ width: 2, color, alpha: 0.85 });
    return;
  }

  graphic.circle(0, 0, size * 0.52).fill({ alpha: 0.82, color });
}

function pickParticleColor(kind: ParticleKind): number {
  const colorMap: Record<ParticleKind, number[]> = {
    // Highly saturated colors stay vibrant when tinting grey symbol sprites, especially at night.
    heart: [0xff1144, 0xff3366, 0xff1188],
    star: [0xffea00, 0xffcc00, 0xffd500],
    zzz: basePalette.zzz,
    dot: basePalette.confetti,
  };
  const colors = colorMap[kind];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ---------------------------------------------------------------------------
// Day/night interpolation
// ---------------------------------------------------------------------------

/**
 * Selects or blends the active day/night palette.
 *
 * Most of each phase is held steady, then the final 30% blends into the next phase.
 * That avoids constant low-level color churn while still making transitions feel soft.
 */
function interpolateDayPalette(progress: number): DayPalette {
  // 0.0-0.15 dawn, 0.15-0.5 day, 0.5-0.65 sunset, 0.65-1.0 night
  const phases: { start: number; end: number; phase: DayCyclePhase }[] = [
    { start: 0, end: 0.15, phase: "dawn" },
    { start: 0.15, end: 0.5, phase: "day" },
    { start: 0.5, end: 0.65, phase: "sunset" },
    { start: 0.65, end: 1.0, phase: "night" },
  ];

  let currentIdx = 0;
  for (let i = 0; i < phases.length; i++) {
    if (progress >= phases[i].start && progress < phases[i].end) {
      currentIdx = i;
      break;
    }
  }

  const current = phases[currentIdx];
  const next = phases[(currentIdx + 1) % phases.length];
  const phaseProgress = (progress - current.start) / (current.end - current.start);

  // Transition zone is the last 30% of each phase
  const transitionStart = 0.7;
  if (phaseProgress < transitionStart) {
    return dayPalettes[current.phase];
  }

  const t = (phaseProgress - transitionStart) / (1 - transitionStart);
  const from = dayPalettes[current.phase];
  const to = dayPalettes[next.phase];

  return {
    skyTop: lerpColor(from.skyTop, to.skyTop, t),
    skyBottom: lerpColor(from.skyBottom, to.skyBottom, t),
    tileA: lerpHex(from.tileA, to.tileA, t),
    tileB: lerpHex(from.tileB, to.tileB, t),
    tileStroke: lerpHex(from.tileStroke, to.tileStroke, t),
    shadowAlpha: from.shadowAlpha + (to.shadowAlpha - from.shadowAlpha) * t,
    tileAlpha: from.tileAlpha + (to.tileAlpha - from.tileAlpha) * t,
  };
}

function lerpColor(a: string, b: string, t: number): string {
  const ra = parseInt(a.slice(1, 3), 16),
    ga = parseInt(a.slice(3, 5), 16),
    ba = parseInt(a.slice(5, 7), 16);
  const rb = parseInt(b.slice(1, 3), 16),
    gb = parseInt(b.slice(3, 5), 16),
    bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ra + (rb - ra) * t);
  const g = Math.round(ga + (gb - ga) * t);
  const bl = Math.round(ba + (bb - ba) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function lerpHex(a: number, b: number, t: number): number {
  const ra = (a >> 16) & 0xff,
    ga = (a >> 8) & 0xff,
    ba = a & 0xff;
  const rb = (b >> 16) & 0xff,
    gb = (b >> 8) & 0xff,
    bb = b & 0xff;
  const r = Math.round(ra + (rb - ra) * t);
  const g = Math.round(ga + (gb - ga) * t);
  const bl = Math.round(ba + (bb - ba) * t);
  return (r << 16) | (g << 8) | bl;
}

function hexToNumber(hex: string): number {
  return parseInt(hex.slice(1), 16);
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

export function formatNumber(value: number, dropDecimals: boolean = false): string {
  // Idle-game values grow quickly; compact notation keeps buttons and HUD pills from
  // reflowing as progression scales into large numbers.
  if (!Number.isFinite(value)) return "∞";
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  if (absolute < 1000) {
    if (dropDecimals) return sign + absolute.toFixed(0);
    return sign + (absolute >= 100 ? absolute.toFixed(0) : absolute.toFixed(1).replace(/\.0$/, ""));
  }

  const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
  const tier = Math.floor(Math.log10(absolute) / 3);
  const suffix = tier < suffixes.length ? suffixes[tier] : getAlphabeticSuffix(tier - suffixes.length);
  const scaled = absolute / Math.pow(1000, tier);

  if (dropDecimals) return `${sign}${scaled.toFixed(0)}${suffix}`;

  const formatted = scaled >= 100 ? scaled.toFixed(0) : scaled >= 10 ? scaled.toFixed(1) : scaled.toFixed(2);
  return `${sign}${formatted.replace(/\.0+$|(\.\d*[1-9])0+$/, "$1")}${suffix}`;
}

function getAlphabeticSuffix(index: number): string {
  // After the named suffixes, keep generating deterministic two-letter suffixes so
  // formatting keeps working even if balancing accidentally permits absurd values.
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let value = index;
  let suffix = "";
  do {
    suffix = alphabet[value % alphabet.length] + suffix;
    value = Math.floor(value / alphabet.length) - 1;
  } while (value >= 0);
  return suffix.padStart(2, "a");
}

function weightedChoice<T extends { weight: number }>(items: T[], randomValue: () => number): T {
  // Accept the RNG as a dependency so starter generation can be seeded while normal
  // hatching still uses Math.random.
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = randomValue() * totalWeight;
  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) return item;
  }
  return items[items.length - 1];
}

function seededRandom(seed: string): () => number {
  // Minimal deterministic generator: good enough for stable cosmetic defaults, not
  // intended for security or statistically sensitive reward tables.
  let value = Math.floor(hashToUnit(seed) * 2147483647) || 1;
  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
}

function hashToUnit(value: string): number {
  // FNV-1a style hashing gives stable per-id variation without storing extra fields
  // in localStorage for every cosmetic jitter value.
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

function createAnimalId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
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
