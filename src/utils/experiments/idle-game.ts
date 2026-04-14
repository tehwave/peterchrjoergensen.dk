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
type ParticleKind = "heart" | "sparkle" | "dot" | "zzz";
type DayCyclePhase = "dawn" | "day" | "sunset" | "night";

interface AnimalDefinition {
  id: AnimalSpeciesId;
  label: string;
  asset: string;
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

interface IdleGameState {
  animals: PersistedAnimal[];
  resources: Resources;
  paused: boolean;
  lastUpdatedAt: number;
  lastMessage: string;
  dayCycleTime: number;
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
  sleepTimer: number;
  heartTimer: number;
  zzzTimer: number;
  wakeBouncePending: boolean;
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
  coins: HTMLElement;
  mood: HTMLElement;
  summary: HTMLElement;
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

let activeGame: IdleGameMount | null = null;
let activeMountToken = 0;
let cleanupRegistered = false;
let texturesPromise: Promise<Map<AnimalSpeciesId, Texture>> | null = null;

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

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
      if (feedback) feedback.textContent = "Idle game failed to load. Try refreshing the page.";
    });
}

// ---------------------------------------------------------------------------
// Mount
// ---------------------------------------------------------------------------

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

  // Layers
  const bgLayer = new Container();
  const worldLayer = new Container();
  const particleLayer = new Container();
  const animalLayer = new Container();
  const ground = new Graphics();
  const worldShadow = new Graphics();
  const bgGraphics = new Graphics();

  bgLayer.addChild(bgGraphics);
  worldLayer.sortableChildren = true;
  particleLayer.sortableChildren = true;
  animalLayer.sortableChildren = true;

  worldLayer.addChild(worldShadow);
  worldLayer.addChild(ground);
  worldLayer.addChild(animalLayer);
  app.stage.addChild(bgLayer);
  app.stage.addChild(worldLayer);
  app.stage.addChild(particleLayer);

  // State
  const state = hydrateState();
  let feedbackMessage = state.lastMessage || "A tiny cozy meadow is ready.";
  let saveTimer = 0;
  let summaryTimer = 0;
  let coinTimer = 0;
  let destroyed = false;
  let lastTime = performance.now();
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;
  let populationPressureState: "normal" | "warning" = "normal";
  let shopOpen = false;
  const particles: Particle[] = [];
  const animals = state.animals.map((p) => createAnimal(p, textures));

  const project = (worldX: number, worldY: number, elevation = 0) =>
    projectWithViewport(lastViewportWidth || ui.stage.clientWidth || 420, lastViewportHeight || ui.stage.clientHeight || 560, worldX, worldY, elevation);

  rebuildGround();
  animals.forEach((a) => animalLayer.addChild(a.view.container));
  updateFeedback(feedbackMessage);
  updateHUD();
  updateSummary();
  renderAnimals(0);
  renderShopList();

  // Click on canvas to wake sleeping animals
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
    animal.bounceVelocity += reducedMotion ? 1.5 : 4.0;
    animal.turnImpulse = 1;
    animal.happiness = clamp(animal.happiness + 0.12, 0, 1);
    spawnParticleBurst(animal.x, animal.y, "sparkle", reducedMotion ? 6 : 12);
    spawnParticleBurst(animal.x, animal.y, "heart", reducedMotion ? 3 : 6);
    updateFeedback(`${animal.definition.label} woke up with a springy bounce!`);
  }

  // Event handlers
  const handleFeed = () => {
    if (state.paused) {
      updateFeedback("Unpause first, then feed.");
      return;
    }
    if (state.resources.food < FEED_COST) {
      updateFeedback("Not enough food yet — wait for it to refill.");
      return;
    }

    state.resources.food = clamp(state.resources.food - FEED_COST, 0, state.resources.foodCapacity);
    const feedPoint = { x: randomBetween(-2.2, 2.2), y: randomBetween(-1.8, 1.8) };

    const awakeAnimals = animals.filter((a) => !a.sleeping);
    const nearbyAnimals = awakeAnimals
      .map((animal) => ({ animal, distance: distanceSq(animal.x, animal.y, feedPoint.x, feedPoint.y) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, Math.min(awakeAnimals.length, 7));

    nearbyAnimals.forEach(({ animal }, index) => {
      animal.targetX = clamp(feedPoint.x + randomBetween(-0.6, 0.6), minX(), maxX());
      animal.targetY = clamp(feedPoint.y + randomBetween(-0.6, 0.6), minY(), maxY());
      animal.feedTargetUntil = performance.now() + 3200 + index * 60;
      animal.hunger = clamp(animal.hunger + 0.34, 0, 1);
      animal.happiness = clamp(animal.happiness + 0.18, 0, 1);
      animal.bounceVelocity += reducedMotion ? 0.8 : 1.8;
      animal.turnImpulse = 1;
    });

    spawnParticleBurst(feedPoint.x, feedPoint.y, "heart", reducedMotion ? 5 : 9);
    updateFeedback(`Snack drop! ${nearbyAnimals.length} animals waddling over.`);
    persistSoon();
    updateHUD();
    updateSummary();
  };

  const handlePopulate = () => {
    const now = Date.now();
    if (state.paused) {
      updateFeedback("Unpause first.");
      return;
    }
    if (animals.length >= state.resources.populationCap) {
      updateFeedback("Meadow is full!");
      return;
    }
    if (state.resources.populateCooldownUntil > now) {
      const s = Math.ceil((state.resources.populateCooldownUntil - now) / 1000);
      updateFeedback(`Cooldown: ${s}s`);
      return;
    }

    const happyAdults = animals.filter((a) => a.growth >= 0.96 && a.happiness >= 0.5 && a.hunger >= 0.4 && !a.sleeping);
    if (happyAdults.length < 2) {
      updateFeedback("Need 2+ happy awake adults to hatch.");
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
        sleeping: false,
      },
      textures,
    );

    animals.push(baby);
    animalLayer.addChild(baby.view.container);
    happyAdults.slice(0, 2).forEach((a) => {
      a.happiness = clamp(a.happiness - 0.08, 0, 1);
      a.bounceVelocity += reducedMotion ? 0.6 : 1.2;
    });
    state.resources.populateCooldownUntil = now + POPULATE_COOLDOWN_MS;
    spawnParticleBurst(baby.x, baby.y, "sparkle", reducedMotion ? 10 : 16);
    spawnParticleBurst(baby.x, baby.y, "dot", reducedMotion ? 7 : 10);

    const rarityLabel = species.rarity !== "common" ? ` (${species.rarity})` : "";
    updateFeedback(`A tiny ${species.label.toLowerCase()}${rarityLabel} hatched!`);
    persistSoon();
    updateHUD();
    updateSummary();
  };

  const handleShopToggle = () => {
    shopOpen = !shopOpen;
    ui.shopDrawer.hidden = !shopOpen;
    if (shopOpen) renderShopList();
  };

  const handleShopClose = () => {
    shopOpen = false;
    ui.shopDrawer.hidden = true;
  };

  const handlePauseToggle = () => {
    state.paused = !state.paused;
    if (state.paused) {
      app.ticker.stop();
      updateFeedback("Paused.");
    } else {
      lastTime = performance.now();
      app.ticker.start();
      updateFeedback("Resumed.");
    }
    updateHUD();
    persistSoon(true);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) app.ticker.stop();
    else if (!state.paused) {
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

  // --- Shop ---
  function handleShopBuy(speciesId: AnimalSpeciesId): void {
    const def = animalDefinitionMap.get(speciesId);
    if (!def) return;
    if (state.resources.coins < def.shopCost) {
      updateFeedback("Not enough coins!");
      return;
    }
    if (animals.length >= state.resources.populationCap) {
      updateFeedback("Meadow is full!");
      return;
    }

    state.resources.coins -= def.shopCost;
    const baby = createAnimal(
      {
        id: createAnimalId(),
        species: def.id,
        x: clamp(randomBetween(-1.4, 1.4), minX(), maxX()),
        y: clamp(randomBetween(-1.1, 1.1), minY(), maxY()),
        age: 0,
        growth: 0.58,
        hunger: 0.84,
        happiness: 0.82,
        sleeping: false,
      },
      textures,
    );
    animals.push(baby);
    animalLayer.addChild(baby.view.container);
    spawnParticleBurst(baby.x, baby.y, "sparkle", 16);
    spawnParticleBurst(baby.x, baby.y, "heart", 8);
    updateFeedback(`Bought a ${def.rarity} ${def.label.toLowerCase()}!`);
    persistSoon();
    updateHUD();
    updateSummary();
    renderShopList();
  }

  function renderShopList(): void {
    const buyableSpecies = animalDefinitions.filter((d) => d.shopCost > 0);
    ui.shopList.innerHTML = "";
    for (const def of buyableSpecies) {
      const item = document.createElement("div");
      item.className = "shop-item";

      const img = document.createElement("img");
      img.className = "shop-item__icon";
      img.src = def.asset;
      img.alt = def.label;
      item.appendChild(img);

      const info = document.createElement("div");
      info.className = "shop-item__info";
      info.innerHTML = `<div class="shop-item__name">${def.label}</div><div class="shop-item__rarity shop-item__rarity--${def.rarity}">${def.rarity}</div><div class="shop-item__stats">+${def.coinsPerSecond}/s coins</div>`;
      item.appendChild(info);

      const btn = document.createElement("button");
      btn.className = "shop-item__buy";
      btn.textContent = `✨ ${def.shopCost}`;
      btn.disabled = state.resources.coins < def.shopCost || animals.length >= state.resources.populationCap;
      btn.addEventListener("click", () => handleShopBuy(def.id));
      item.appendChild(btn);

      ui.shopList.appendChild(item);
    }
  }

  // --- Main tick ---
  app.ticker.add(() => {
    const now = performance.now();
    const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (destroyed) return;

    if (ui.stage.clientWidth !== lastViewportWidth || ui.stage.clientHeight !== lastViewportHeight) {
      rebuildGround();
      lastViewportWidth = ui.stage.clientWidth;
      lastViewportHeight = ui.stage.clientHeight;
    }

    // Always animate background (even when paused for ambience)
    state.dayCycleTime = (state.dayCycleTime + deltaSeconds) % DAY_CYCLE_DURATION;
    renderBackground();

    if (state.paused) return;

    tickResources(deltaSeconds);
    tickCoins(deltaSeconds);
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

  if (document.hidden || state.paused) app.ticker.stop();

  // --- Tick functions ---

  function tickResources(deltaSeconds: number): void {
    state.resources.food = clamp(state.resources.food + FOOD_REGEN_PER_SECOND * deltaSeconds, 0, state.resources.foodCapacity);
  }

  function tickCoins(deltaSeconds: number): void {
    coinTimer += deltaSeconds;
    if (coinTimer < COIN_TICK_INTERVAL) return;
    coinTimer -= COIN_TICK_INTERVAL;

    let totalCoinsPerSecond = 0;
    for (const animal of animals) {
      if (!animal.sleeping && animal.growth >= 0.96) {
        totalCoinsPerSecond += animal.definition.coinsPerSecond;
      }
    }
    state.resources.coins += totalCoinsPerSecond * COIN_TICK_INTERVAL;
  }

  function tickAnimals(deltaSeconds: number, prefersReducedMotion: boolean): void {
    const nowMs = Date.now();
    const nowPerf = performance.now();

    for (const animal of animals) {
      animal.age += deltaSeconds;
      animal.growth = clamp(animal.growth + deltaSeconds / BABY_GROWTH_SECONDS, 0.58, 1);
      animal.hunger = clamp(animal.hunger - HUNGER_DECAY_PER_SECOND * deltaSeconds, 0, 1);
      const happinessDrift = (animal.hunger - HUNGER_NEUTRAL_POINT) * HAPPINESS_HUNGER_COUPLING * deltaSeconds - HAPPINESS_DECAY_PER_SECOND * deltaSeconds;
      animal.happiness = clamp(animal.happiness + happinessDrift, 0, 1);

      // Sleep logic
      if (animal.sleeping) {
        animal.sleepTimer -= deltaSeconds;
        animal.zzzTimer -= deltaSeconds;
        if (animal.zzzTimer <= 0) {
          animal.zzzTimer = ZZZ_EMIT_INTERVAL + randomBetween(-0.3, 0.3);
          if (!prefersReducedMotion) spawnParticleBurst(animal.x, animal.y - 0.3, "zzz", 1);
        }
        if (animal.sleepTimer <= 0) {
          animal.sleeping = false;
          animal.bounceVelocity += 0.6;
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
        animal.bounceVelocity += prefersReducedMotion ? 1.5 : 3.5;
      }

      // Wandering
      animal.wanderCooldown -= deltaSeconds;
      if (animal.feedTargetUntil <= nowPerf && animal.wanderCooldown <= 0) {
        animal.targetX = clamp(animal.x + randomBetween(-2.8, 2.8), minX(), maxX());
        animal.targetY = clamp(animal.y + randomBetween(-2.6, 2.6), minY(), maxY());
        animal.wanderCooldown = randomBetween(1.2, 3.4);
      }

      // Separation
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
      const hungerUrgency = 0.6 + (1 - animal.hunger) * 0.45;
      const maxSpeed = animal.feedTargetUntil > nowPerf ? 1.8 : 1.1 + hungerUrgency * 0.8;
      const desiredX = (targetDx / targetDistance) * maxSpeed + separationX * 0.55;
      const desiredY = (targetDy / targetDistance) * maxSpeed + separationY * 0.55;

      animal.vx += (desiredX - animal.vx) * Math.min(5 * deltaSeconds, 1);
      animal.vy += (desiredY - animal.vy) * Math.min(5 * deltaSeconds, 1);
      animal.vx *= 0.92;
      animal.vy *= 0.92;

      const prevVx = animal.vx;
      const prevVy = animal.vy;

      animal.x = clamp(animal.x + animal.vx * deltaSeconds, minX(), maxX());
      animal.y = clamp(animal.y + animal.vy * deltaSeconds, minY(), maxY());

      if (animal.x <= minX() || animal.x >= maxX()) animal.vx *= -0.4;
      if (animal.y <= minY() || animal.y >= maxY()) animal.vy *= -0.4;

      const turnDelta = Math.abs(prevVx - animal.vx) + Math.abs(prevVy - animal.vy);
      if (turnDelta > 0.05) animal.turnImpulse = clamp(animal.turnImpulse + turnDelta * 1.5, 0, 1);

      tickAnimalSpring(animal, deltaSeconds, prefersReducedMotion);
    }

    updatePopulationPressureFeedback(nowMs);
  }

  function tickAnimalSpring(animal: Animal, deltaSeconds: number, prefersReducedMotion: boolean): void {
    const springTension = prefersReducedMotion ? 7 : 12;
    const springDamping = prefersReducedMotion ? 0.78 : 0.72;
    animal.bounceVelocity += (-animal.bounce * springTension + animal.turnImpulse * (prefersReducedMotion ? 0.4 : 0.85)) * deltaSeconds * 8;
    animal.bounceVelocity *= springDamping;
    animal.bounce += animal.bounceVelocity * deltaSeconds * 5;
    animal.turnImpulse *= prefersReducedMotion ? 0.72 : 0.62;
  }

  function tickParticles(deltaSeconds: number, prefersReducedMotion: boolean): void {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.life -= deltaSeconds;
      p.x += p.vx * deltaSeconds;
      p.y += p.vy * deltaSeconds;
      p.z += p.vz * deltaSeconds;
      p.vz -= prefersReducedMotion ? 0.6 * deltaSeconds : 1.5 * deltaSeconds;
      p.graphic.rotation += p.spin * deltaSeconds;

      if (p.life <= 0) {
        p.graphic.destroy();
        particles.splice(i, 1);
        continue;
      }

      const { x, y } = project(p.x, p.y, p.z);
      const lifeRatio = p.life / p.maxLife;
      p.graphic.position.set(x, y);
      p.graphic.alpha = lifeRatio;
      p.graphic.scale.set(0.6 + (1 - lifeRatio) * 0.45);
      p.graphic.zIndex = y + 400;
    }
  }

  function renderAnimals(time: number): void {
    for (const animal of animals) {
      const isSleeping = animal.sleeping;
      const bobAmp = isSleeping ? 3 : reducedMotion ? 2 : IDLE_BOB_AMPLITUDE;
      const bobFreq = isSleeping ? 0.8 : reducedMotion ? 1.4 : 2;
      const bob = Math.sin(time * bobFreq + animal.bobPhase) * bobAmp;
      const bounce = animal.bounce * (reducedMotion ? 3 : 7);
      const screen = project(animal.x, animal.y, 0);
      const scale = animal.spriteScale * animal.growth;
      const moodTint = isSleeping ? 0xd8d0e8 : applyMoodTint(animal);
      const speed = Math.hypot(animal.vx, animal.vy);
      const stretch = clamp(speed * 0.09 + Math.abs(animal.bounce) * 0.08, 0, reducedMotion ? 0.05 : 0.14);
      const direction = animal.vx >= 0 ? 1 : -1;

      // Rarity glow
      const rarityColor = RARITY_COLORS[animal.definition.rarity];
      if (animal.definition.rarity !== "common" && !isSleeping) {
        animal.view.shadow.tint = rarityColor;
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

  // --- Background ---
  function renderBackground(): void {
    const w = lastViewportWidth || ui.stage.clientWidth || 420;
    const h = lastViewportHeight || ui.stage.clientHeight || 560;
    const progress = state.dayCycleTime / DAY_CYCLE_DURATION;
    const pal = interpolateDayPalette(progress);

    bgGraphics.clear();
    bgGraphics.rect(0, 0, w, h).fill({ color: hexToNumber(pal.skyBottom) });

    // Gradient overlay
    const topColor = hexToNumber(pal.skyTop);
    bgGraphics.rect(0, 0, w, h * 0.6).fill({ color: topColor, alpha: 0.7 });
  }

  function rebuildGround(): void {
    const width = ui.stage.clientWidth;
    const height = Math.max(ui.stage.clientHeight, 420);
    lastViewportWidth = width;
    lastViewportHeight = height;

    ground.clear();
    worldShadow.clear();

    const progress = state.dayCycleTime / DAY_CYCLE_DURATION;
    const pal = interpolateDayPalette(progress);

    const centerX = width * 0.5;
    const centerY = height * 0.35;
    const isoX = Math.min(width / 16, 42);
    const isoY = isoX * 0.48;

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

  function spawnParticleBurst(worldX: number, worldY: number, kind: ParticleKind, count: number): void {
    for (let i = 0; i < count; i += 1) {
      const graphic = new Graphics();
      const color = pickParticleColor(kind);
      const size = kind === "zzz" ? 6 + Math.random() * 4 : 4 + Math.random() * 6;
      drawParticleShape(graphic, kind, color, size);
      const isZzz = kind === "zzz";
      const particle: Particle = {
        graphic,
        x: worldX + randomBetween(-0.4, 0.4),
        y: worldY + randomBetween(-0.4, 0.4),
        z: Math.random() * (isZzz ? 10 : 18),
        vx: isZzz ? randomBetween(-0.15, 0.15) : randomBetween(-0.6, 0.6),
        vy: isZzz ? randomBetween(-0.05, 0.05) : randomBetween(-0.6, 0.6),
        vz: isZzz ? randomBetween(0.3, 0.6) : randomBetween(0.6, 1.2),
        life: isZzz ? randomBetween(1.0, 1.6) : randomBetween(0.7, 1.3),
        maxLife: isZzz ? 1.6 : 1.4,
        spin: isZzz ? randomBetween(-0.3, 0.3) : randomBetween(-1.6, 1.6),
      };
      particleLayer.addChild(graphic);
      particles.push(particle);
    }
  }

  // --- HUD ---
  function updateHUD(): void {
    const populationPressure = animals.length / state.resources.populationCap;
    const averageMood = animals.length === 0 ? 0 : animals.reduce((s, a) => s + a.happiness, 0) / animals.length;

    const popEl = ui.population.querySelector("b");
    const foodEl = ui.food.querySelector("b");
    const coinsEl = ui.coins.querySelector("b");
    const moodEl = ui.mood.querySelector("b");

    if (popEl) popEl.textContent = `${animals.length}/${state.resources.populationCap}`;
    if (foodEl) foodEl.textContent = `${Math.floor(state.resources.food)}/${state.resources.foodCapacity}`;
    if (coinsEl) coinsEl.textContent = `${Math.floor(state.resources.coins)}`;
    if (moodEl) moodEl.textContent = `${Math.round(averageMood * 100)}%`;

    ui.feedback.textContent = feedbackMessage;
    ui.pauseButton.textContent = state.paused ? "▶ Play" : "⏸ Pause";
    ui.feedButton.disabled = state.resources.food < FEED_COST;
    ui.populateButton.disabled = state.paused || animals.length >= state.resources.populationCap || state.resources.populateCooldownUntil > Date.now();
    ui.root.dataset.populationPressure = populationPressure >= 1 ? "full" : populationPressure >= FEEDBACK_LOW_CAP_THRESHOLD ? "warning" : "normal";
  }

  function updateSummary(): void {
    const sleepCount = animals.filter((a) => a.sleeping).length;
    const totalCps = animals.reduce((s, a) => s + (a.sleeping || a.growth < 0.96 ? 0 : a.definition.coinsPerSecond), 0);
    const awake = animals.length - sleepCount;
    ui.summary.textContent = `${animals.length} animals (${awake} awake, ${sleepCount} sleeping), ${Math.floor(state.resources.food)} food, ${Math.floor(state.resources.coins)} coins (+${totalCps.toFixed(1)}/s). Tap sleeping animals to wake them!`;
  }

  function updateFeedback(message: string): void {
    feedbackMessage = message;
    ui.feedback.textContent = message;
  }

  function updatePopulationPressureFeedback(nowMs: number): void {
    const isWarning = nowMs > state.resources.populateCooldownUntil && animals.length / state.resources.populationCap >= FEEDBACK_LOW_CAP_THRESHOLD;
    const nextState = isWarning ? "warning" : "normal";
    if (nextState === populationPressureState) return;
    populationPressureState = nextState;
    if (nextState === "warning") updateFeedback(POPULATION_PRESSURE_MESSAGE);
  }

  function persistSoon(force = false): void {
    state.lastMessage = feedbackMessage;
    state.lastUpdatedAt = Date.now();
    if (force || !destroyed) {
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
        resources: state.resources,
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
    app.canvas.removeEventListener("pointerdown", handleCanvasTap);
    ui.feedButton.removeEventListener("click", handleFeed);
    ui.populateButton.removeEventListener("click", handlePopulate);
    ui.shopButton.removeEventListener("click", handleShopToggle);
    ui.shopClose.removeEventListener("click", handleShopClose);
    ui.pauseButton.removeEventListener("click", handlePauseToggle);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionMedia.removeEventListener("change", handleReducedMotionChange);
    app.ticker.stop();
    particleLayer.removeChildren().forEach((c) => c.destroy());
    animalLayer.removeChildren().forEach((c) => c.destroy());
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
  const mood = root.querySelector<HTMLElement>("[data-idle-game-mood]");
  const summary = root.querySelector<HTMLElement>("[data-idle-game-summary]");
  const feedback = root.querySelector<HTMLElement>("[data-idle-game-feedback]");
  const feedButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='feed']");
  const populateButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='populate']");
  const shopButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='shop']");
  const pauseButton = root.querySelector<HTMLButtonElement>("[data-idle-game-action='pause']");
  const shopDrawer = root.querySelector<HTMLElement>("[data-idle-game-shop]");
  const shopClose = root.querySelector<HTMLButtonElement>("[data-idle-game-shop-close]");
  const shopList = root.querySelector<HTMLElement>("[data-idle-game-shop-list]");

  if (!stage || !population || !food || !coins || !mood || !summary || !feedback || !feedButton || !populateButton || !shopButton || !pauseButton || !shopDrawer || !shopClose || !shopList) {
    throw new Error("Idle game mount points are missing.");
  }

  return { root, stage, population, food, coins, mood, summary, feedback, feedButton, populateButton, shopButton, pauseButton, shopDrawer, shopClose, shopList };
}

async function loadAnimalTextures(): Promise<Map<AnimalSpeciesId, Texture>> {
  if (!texturesPromise) {
    texturesPromise = Promise.all(
      animalDefinitions.map(async (d) => {
        const texture = await Assets.load(d.asset);
        texture.source.scaleMode = "nearest";
        return [d.id, texture] as const;
      }),
    ).then((entries) => new Map(entries));
  }
  return texturesPromise;
}

// ---------------------------------------------------------------------------
// State persistence
// ---------------------------------------------------------------------------

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

function persistState(state: IdleGameState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createDefaultState(): IdleGameState {
  const animals = Array.from({ length: STARTING_POPULATION }, (_, i) => {
    const species = weightedChoice(
      animalDefinitions.filter((d) => d.rarity === "common"),
      seededRandom(`starter-${i}`),
    );
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
    resources: { food: STARTING_FOOD, foodCapacity: 90, coins: STARTING_COINS, populationCap: 20, populateCooldownUntil: 0 },
    paused: false,
    lastUpdatedAt: Date.now(),
    lastMessage: "A fresh pastel meadow has bloomed.",
    dayCycleTime: 30,
  };
}

function applyOfflineCatchup(state: IdleGameState): IdleGameState {
  const now = Date.now();
  const elapsedMs = clamp(now - state.lastUpdatedAt, 0, MAX_OFFLINE_MS);
  const elapsedSeconds = elapsedMs / 1000;

  let offlineCoins = 0;
  const animals = state.animals.map((a) => {
    const def = animalDefinitionMap.get(a.species);
    if (def && a.growth >= 0.96 && !a.sleeping) offlineCoins += def.coinsPerSecond * elapsedSeconds;
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
      food: clamp(state.resources.food + FOOD_REGEN_PER_SECOND * elapsedSeconds, 0, state.resources.foodCapacity),
      coins: (state.resources.coins || 0) + offlineCoins,
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

  const validatedAnimals = c.animals
    .map((a) => validateAnimal(a))
    .filter((a): a is PersistedAnimal => Boolean(a))
    .slice(0, 30);
  const resources = c.resources as Partial<Resources>;
  if (!hasValidResourceShape(resources)) return null;

  return {
    animals: validatedAnimals.length > 0 ? validatedAnimals : createDefaultState().animals,
    resources: {
      food: clamp(resources.food, 0, resources.foodCapacity),
      foodCapacity: clamp(resources.foodCapacity, 20, 200),
      coins: Math.max(0, resources.coins || 0),
      populationCap: clamp(resources.populationCap, 6, 40),
      populateCooldownUntil: Math.max(0, resources.populateCooldownUntil),
    },
    paused: Boolean(c.paused),
    lastUpdatedAt: typeof c.lastUpdatedAt === "number" ? c.lastUpdatedAt : Date.now(),
    lastMessage: typeof c.lastMessage === "string" ? c.lastMessage : "Welcome back to the meadow.",
    dayCycleTime: typeof c.dayCycleTime === "number" ? c.dayCycleTime % DAY_CYCLE_DURATION : 30,
  };
}

function validateAnimal(input: unknown): PersistedAnimal | null {
  if (!input || typeof input !== "object") return null;
  const c = input as Partial<PersistedAnimal>;
  if (
    typeof c.id !== "string" ||
    !animalDefinitionMap.has(c.species as AnimalSpeciesId) ||
    typeof c.x !== "number" ||
    typeof c.y !== "number" ||
    typeof c.age !== "number" ||
    typeof c.growth !== "number" ||
    typeof c.hunger !== "number" ||
    typeof c.happiness !== "number"
  )
    return null;

  return {
    id: c.id,
    species: c.species as AnimalSpeciesId,
    x: clamp(c.x, -WORLD_WIDTH / 2, WORLD_WIDTH / 2),
    y: clamp(c.y, -WORLD_DEPTH / 2, WORLD_DEPTH / 2),
    age: Math.max(0, c.age),
    growth: clamp(c.growth, 0.58, 1),
    hunger: clamp(c.hunger, 0, 1),
    happiness: clamp(c.happiness, 0, 1),
    sleeping: Boolean(c.sleeping),
  };
}

function hasValidResourceShape(r: Partial<Resources>): r is Resources {
  return typeof r.food === "number" && typeof r.foodCapacity === "number" && typeof r.populationCap === "number" && typeof r.populateCooldownUntil === "number";
}

// ---------------------------------------------------------------------------
// Animal creation
// ---------------------------------------------------------------------------

function createAnimal(persisted: PersistedAnimal, textures: Map<AnimalSpeciesId, Texture>): Animal {
  const definition = animalDefinitionMap.get(persisted.species);
  const texture = textures.get(persisted.species);
  if (!definition || !texture) throw new Error(`Missing definition or texture for ${persisted.species}`);

  const view = createAnimalSprite(texture);
  const bobPhase = hashToUnit(`${persisted.id}:bob`) * Math.PI * 2;
  const scaleJitter = 0.92 + hashToUnit(`${persisted.id}:scale`) * 0.16;

  return {
    ...persisted,
    vx: 0,
    vy: 0,
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
    zzzTimer: 0,
    wakeBouncePending: false,
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

  shadow.ellipse(0, -6, 28, 16).fill({ alpha: 0.18, color: basePalette.shadow });
  shadow.position.set(0, 0);

  container.addChild(shadow);
  container.addChild(sprite);

  return { container, sprite, shadow };
}

function applyMoodTint(animal: Animal): number {
  const mood = animal.happiness * 0.6 + animal.hunger * 0.4;
  if (mood > 0.82) return 0xffffff;
  if (mood > 0.52) return 0xf7f2ff;
  return 0xf6e3d4;
}

// ---------------------------------------------------------------------------
// Projection
// ---------------------------------------------------------------------------

function projectWithViewport(width: number, height: number, worldX: number, worldY: number, elevation = 0): { x: number; y: number } {
  const isoX = Math.min(width / 16, 42);
  const isoY = isoX * 0.48;
  return {
    x: width * 0.5 + (worldX - worldY) * isoX,
    y: height * 0.34 + (worldX + worldY) * isoY - elevation,
  };
}

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------

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

  if (kind === "zzz") {
    // Draw a "Z" shape
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
  const colors = kind === "heart" ? basePalette.heart : kind === "sparkle" ? basePalette.sparkle : kind === "zzz" ? basePalette.zzz : basePalette.confetti;
  return colors[Math.floor(Math.random() * colors.length)];
}

// ---------------------------------------------------------------------------
// Day/night interpolation
// ---------------------------------------------------------------------------

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

function weightedChoice<T extends { weight: number }>(items: T[], randomValue: () => number): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = randomValue() * totalWeight;
  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) return item;
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
