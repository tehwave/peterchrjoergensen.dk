import type { Project } from "../types";
import type { Locale } from "../i18n/locale";

// Import project images for Astro optimization
import janchartImg from "../assets/projects/janchart.png";
import grundfosImg from "../assets/projects/grundfos.png";
import firkantImg from "../assets/projects/firkant.png";
import gm48Img from "../assets/projects/gm48.png";
import websiteImg from "../assets/projects/website.png";
import groovyWavesImg from "../assets/projects/groovy-waves.png";
import idleGameImg from "../assets/projects/idle-game.png";
import odensegolfklubImg from "../assets/projects/odensegolfklub.png";
import westernImg from "../assets/projects/western.jpg";
import mordombordImg from "../assets/projects/mordombord.png";
import torpedoTrumpImg from "../assets/projects/torpedo-trump.png";

// Client projects
import kirppuImg from "../assets/projects/kirppu.png";
import planetHuseImg from "../assets/projects/planet-huse.png";
import planetLivingImg from "../assets/projects/planet-living.png";
import solgtImg from "../assets/projects/solgt.png";
import autoproffImg from "../assets/projects/autoproff.png";
import villavillaImg from "../assets/projects/villavilla.png";
import slagterlampeImg from "../assets/projects/slagterlampe.png";
import skioutletImg from "../assets/projects/skioutlet.png";
import dmgreenkeepingImg from "../assets/projects/dmgreenkeeping.png";
import forsiaImg from "../assets/projects/forsia.png";
import autocentralenImg from "../assets/projects/autocentralen.png";
import renellImg from "../assets/projects/renell.png";
import horningfloorImg from "../assets/projects/horningfloor.png";
import restudyImg from "../assets/projects/restudy.png";
import bsiImg from "../assets/projects/bsi.png";
import cctravelImg from "../assets/projects/cctravel.png";
import dinbilpartnerImg from "../assets/projects/dinbilpartner.png";

/**
 * Portfolio projects displayed on the homepage.
 * Each project includes metadata for rendering ProjectCard components.
 */
export const projects: Project[] = [
  // === WEB DEVELOPMENT ===
  {
    title: "Janchart",
    description: "I built the website in Laravel, Bootstrap and jQuery for this chartering, shipping, and shipowners company.",
    alt: "Screenshot of the Janchart shipping company website homepage",
    tags: ["Laravel", "Bootstrap", "jQuery"],
    image: janchartImg,
    link: "https://janchart.dk",
    category: "web",
  },
  {
    title: "Grundfos Safety",
    description: "A gamified quiz web application made in Vue.js with legacy browser support, teaching safety protocols at Grundfos.",
    alt: "Screenshot of the Grundfos Safety quiz application interface",
    tags: ["Vue.js", "JavaScript", "Gamification"],
    image: grundfosImg,
    link: "https://tehwave.github.io/grundfos-quiz/",
    category: "web",
  },
  {
    title: "gm48.net",
    description: "The home of a game jam community I've run since 2013. Built with Laravel — over 48 jams hosted and thousands of games submitted.",
    alt: "Screenshot of gm48.net game jam website homepage",
    tags: ["Laravel", "PHP", "MySQL"],
    image: gm48Img,
    link: "https://gm48.net",
    category: "web",
  },
  {
    title: "This Website",
    description: "Built with Astro, TypeScript and SCSS — with AI assistance for component structure and styling decisions.",
    alt: "Screenshot of my personal portfolio website",
    tags: ["Astro", "TypeScript", "SCSS"],
    image: websiteImg,
    link: "https://github.com/tehwave/peterchrjoergensen.dk",
    category: "web",
  },
  {
    title: "Groovy Waves",
    description: "A wave-design lab for testing canvas-driven UI motifs, embedded borders, motion states, and less boxy component surfaces.",
    alt: "Screenshot of the Groovy Waves experiment showing layered wave UI panels",
    tags: ["Astro", "Canvas", "Motion"],
    image: groovyWavesImg,
    link: "/experiments/groovy-waves/",
    isInternal: true,
    category: "creative",
  },

  // === CLIENT PROJECTS ===
  {
    title: "Solgt.com",
    description: "Tech lead for Denmark's leading car sales platform. Full-stack development across WordPress and Laravel.",
    alt: "Screenshot of Solgt.com car sales platform homepage",
    tags: ["Laravel", "WordPress", "WooCommerce"],
    image: solgtImg,
    link: "https://solgt.com",
    category: "web",
  },
  {
    title: "VillaVilla",
    description: "Senior web developer and tech lead for a luxury vacation rental company. Full-stack WordPress and Laravel.",
    alt: "Screenshot of VillaVilla luxury vacation rental website",
    tags: ["Laravel", "WordPress", "WooCommerce"],
    image: villavillaImg,
    link: "https://villavilla.dk",
    category: "web",
  },
  {
    title: "C&C Travel",
    description: "Laravel admin system with AI integrations for a 35-year-old travel agency specializing in tailor-made trips. WordPress frontend with custom booking flow.",
    alt: "Screenshot of C&C Travel custom travel agency website",
    tags: ["Laravel", "WordPress", "AI"],
    image: cctravelImg,
    link: "https://cctravel.dk",
    category: "web",
  },
  {
    title: "DM Greenkeeping",
    description: "Built the Laravel CRM and quote system that now supports this multi-million lawn care business.",
    alt: "Screenshot of DM Greenkeeping lawn care service website",
    tags: ["Laravel", "CRM", "MySQL"],
    image: dmgreenkeepingImg,
    link: "https://dmgreenkeeping.dk",
    category: "web",
  },
  {
    title: "Restudy",
    description: "Learning CMS platform with WordPress frontend and Laravel backend. Denmark's largest video education portal.",
    alt: "Screenshot of Restudy video education platform",
    tags: ["Laravel", "WordPress", "LMS"],
    image: restudyImg,
    link: "https://restudy.dk",
    category: "web",
  },
  {
    title: "Kirppu",
    description: "Denmark's largest secondhand chain with 34 stores. AI-powered image analysis and Algolia search for their WordPress platform.",
    alt: "Screenshot of Kirppu secondhand marketplace website",
    tags: ["WordPress", "AI", "Algolia"],
    image: kirppuImg,
    link: "https://kirppu.dk",
    category: "web",
  },
  {
    title: "SkiOutlet",
    description: "WordPress webshop with thousands of SKUs imported from Microsoft NAV. Denmark's largest ski outlet.",
    alt: "Screenshot of SkiOutlet ski equipment webshop",
    tags: ["WordPress", "WooCommerce", "CRM"],
    image: skioutletImg,
    link: "https://skioutlet.nu",
    category: "web",
  },
  {
    title: "Slagter Lampe",
    description: "WordPress webshop for a traditional family butcher since 1939. Famous for their award-winning sausages.",
    alt: "Screenshot of Slagter Lampe butcher webshop",
    tags: ["WordPress", "WooCommerce", "PHP"],
    image: slagterlampeImg,
    link: "https://slagterlampe.dk",
    category: "web",
  },
  {
    title: "AutoProff",
    description: "Laravel developer support for this B2B car trading platform operating in 12 European markets.",
    alt: "Screenshot of AutoProff B2B car trading platform",
    tags: ["Laravel", "CRM", "MySQL"],
    image: autoproffImg,
    link: "https://www.autoproff.dk",
    category: "web",
  },
  {
    title: "Din Bilpartner",
    description: "WordPress and Laravel development for Denmark's oldest independent car workshop chain. Built API integrations and the exclusive Express membership club.",
    alt: "Screenshot of Din Bilpartner car workshop website homepage",
    tags: ["WordPress", "Laravel", "API"],
    image: dinbilpartnerImg,
    link: "https://dinbilpartner.dk",
    category: "web",
  },
  {
    title: "Planet Huse",
    description: "WordPress website for a summer house builder with 37+ years of experience.",
    alt: "Screenshot of Planet Huse summer house builder website",
    tags: ["WordPress", "PHP"],
    image: planetHuseImg,
    link: "https://planet-huse.dk",
    category: "web",
  },
  {
    title: "Planet Living",
    description: "WordPress website for modular tiny houses and garden rooms.",
    alt: "Screenshot of Planet Living tiny house website",
    tags: ["WordPress", "PHP"],
    image: planetLivingImg,
    link: "https://planet-living.dk",
    category: "web",
  },
  {
    title: "Forsia",
    description: "Drupal to WordPress migration for this Danish insurance company (formerly Sønderjysk Forsikring).",
    alt: "Screenshot of Forsia insurance company website",
    tags: ["WordPress", "Migration", "Drupal"],
    image: forsiaImg,
    link: "https://forsia.dk",
    category: "web",
  },
  {
    title: "Autocentralen",
    description: "WordPress maintenance and support for a major Danish car dealer with multiple locations.",
    alt: "Screenshot of Autocentralen car dealer website",
    tags: ["WordPress", "PHP"],
    image: autocentralenImg,
    link: "https://www.autocentralen.com",
    category: "web",
  },
  {
    title: "Renell",
    description: "WordPress support for a Swan-certified cleaning company with 700+ employees since 1987.",
    alt: "Screenshot of Renell cleaning company website",
    tags: ["WordPress", "PHP"],
    image: renellImg,
    link: "https://www.renell.dk",
    category: "web",
  },
  {
    title: "Hørning Parket",
    description: "WordPress support for a 90-year-old premium flooring manufacturer targeting architects.",
    alt: "Screenshot of Hørning Floor parquet flooring website",
    tags: ["WordPress", "PHP"],
    image: horningfloorImg,
    link: "https://www.horningfloor.dk",
    category: "web",
  },
  {
    title: "BSI Marine Equipment Group",
    description: "WordPress website for a marine equipment group with 9 specialized brands serving sailboats and super yachts worldwide.",
    alt: "Screenshot of BSI Marine Equipment Group website",
    tags: ["WordPress", "PHP"],
    image: bsiImg,
    link: "https://bsidk.com",
    category: "web",
  },

  // === GAME DEVELOPMENT ===
  {
    title: "FIRKANT",
    description: "A fast-paced procedural platformer I made in GameMaker. Tight controls, instant restarts, and that 'one more try' feeling.",
    alt: "Screenshot of FIRKANT platformer game showing colorful pixel graphics",
    tags: ["GameMaker", "Game Design", "Procedural"],
    image: firkantImg,
    link: "https://firkant.website",
    category: "games",
  },
  {
    title: "Idle Game",
    description: "A pastel PixiJS idle-game prototype with bouncy animals, local persistence, shop progression, and a deliberately cozy mobile-first shell.",
    alt: "Screenshot of the Idle Game experiment showing a pastel meadow with animal sprites and HUD controls",
    tags: ["PixiJS", "TypeScript", "Game Design"],
    image: idleGameImg,
    link: "/experiments/idle-game/",
    isInternal: true,
    category: "games",
  },
  {
    title: "Mord Ombord",
    description: "A murder mystery VR game for Google Cardboard. Heavy optimization work to hit 60fps on budget Android phones.",
    alt: "Screenshot of Mord Ombord VR murder mystery game",
    tags: ["Unity3D", "C#", "VR"],
    image: mordombordImg,
    link: "https://www.youtube.com/watch?v=0U42shiUG2w",
    category: "games",
  },
  {
    title: "Western World",
    description: "A Unity3D environment exploring the Maya-to-Unity asset pipeline. Dusty saloons and tumbleweeds included.",
    alt: "Screenshot of Western World 3D environment in Unity",
    tags: ["Unity3D", "Maya", "3D Art"],
    image: westernImg,
    link: "https://www.youtube.com/watch?v=0SeTUIsS5sQ",
    category: "games",
  },
  {
    title: "Odense Golfklub",
    description: "A Unity3D mobile app with 360° course imagery and 3D flyovers. Built for club members to preview holes before playing.",
    alt: "Screenshot of Odense Golfklub mobile app showing 3D golf course",
    tags: ["Unity3D", "3D", "Mobile"],
    image: odensegolfklubImg,
    category: "games",
  },
  {
    title: "Torpedo Trump",
    description: "A satirical game jam entry that placed 3rd at EAL Game Jam 2016. Made as a political spoof.",
    alt: "Screenshot of Torpedo Trump game showing glitchy presidential imagery",
    tags: ["GameMaker", "Game Design"],
    image: torpedoTrumpImg,
    link: "https://tehwave.itch.io/torpedo-trump-make-america-great-again",
    category: "games",
  },
];

const danishProjectCopy: Record<string, Pick<Project, "description" | "alt">> = {
  Janchart: {
    description: "Jeg byggede hjemmesiden i Laravel, Bootstrap og jQuery for denne virksomhed inden for befragtning, shipping og rederidrift.",
    alt: "Skærmbillede af forsiden på Jancharts hjemmeside for shippingvirksomheden",
  },
  "Grundfos Safety": {
    description: "En gamificeret quiz-webapplikation bygget i Vue.js med understøttelse af ældre browsere, som lærer medarbejdere om sikkerhed hos Grundfos.",
    alt: "Skærmbillede af brugerfladen i quizapplikationen Grundfos Safety",
  },
  "gm48.net": {
    description: "Hjemsted for et game jam-fællesskab, jeg har drevet siden 2013. Bygget i Laravel med mere end 48 afholdte jams og tusindvis af indsendte spil.",
    alt: "Skærmbillede af forsiden på game jam-hjemmesiden gm48.net",
  },
  "This Website": { description: "Bygget med Astro, TypeScript og SCSS med AI-hjælp til komponentstruktur og designbeslutninger.", alt: "Skærmbillede af min personlige portfoliohjemmeside" },
  "Groovy Waves": {
    description: "Et bølgedesignlaboratorium til at afprøve canvas-drevne UI-motiver, indlejrede kanter, bevægelsestilstande og mindre firkantede komponentflader.",
    alt: "Skærmbillede af Groovy Waves-eksperimentet med lagdelte bølgepaneler",
  },
  "Solgt.com": {
    description: "Tech lead for Danmarks førende platform til bilsalg. Full-stack-udvikling på tværs af WordPress og Laravel.",
    alt: "Skærmbillede af forsiden på bilsalgsplatformen Solgt.com",
  },
  VillaVilla: {
    description: "Senior webudvikler og tech lead for en virksomhed med luksusferiehuse. Full-stack WordPress og Laravel.",
    alt: "Skærmbillede af VillaVillas hjemmeside for luksusferiehuse",
  },
  "C&C Travel": {
    description: "Laravel-administrationssystem med AI-integrationer til et 35 år gammelt rejsebureau med skræddersyede rejser. WordPress-frontend med specialbygget bookingflow.",
    alt: "Skærmbillede af C&C Travels specialbyggede rejsehjemmeside",
  },
  "DM Greenkeeping": {
    description: "Jeg byggede Laravel-CRM'et og tilbudssystemet, som nu understøtter denne plæneplejevirksomhed med millionomsætning.",
    alt: "Skærmbillede af DM Greenkeepings hjemmeside for plænepleje",
  },
  Restudy: { description: "Læringsplatform med WordPress-frontend og Laravel-backend. Danmarks største portal for videoundervisning.", alt: "Skærmbillede af Restudys platform for videoundervisning" },
  Kirppu: {
    description: "Danmarks største genbrugskæde med 34 butikker. AI-baseret billedanalyse og Algolia-søgning på deres WordPress-platform.",
    alt: "Skærmbillede af Kirppus hjemmeside for genbrugsmarkedet",
  },
  SkiOutlet: { description: "WordPress-webshop med tusindvis af varenumre importeret fra Microsoft NAV. Danmarks største skioutlet.", alt: "Skærmbillede af SkiOutlets webshop for skiudstyr" },
  "Slagter Lampe": { description: "WordPress-webshop for en traditionsrig familieslagter fra 1939, kendt for sine prisvindende pølser.", alt: "Skærmbillede af Slagter Lampes webshop" },
  AutoProff: { description: "Laravel-udviklersupport til denne B2B-platform for bilhandel på 12 europæiske markeder.", alt: "Skærmbillede af AutoProffs B2B-platform for bilhandel" },
  "Din Bilpartner": {
    description: "WordPress- og Laravel-udvikling for Danmarks ældste frie værkstedskæde. Jeg byggede API-integrationer og den eksklusive Express-medlemsklub.",
    alt: "Skærmbillede af forsiden på Din Bilpartners værkstedshjemmeside",
  },
  "Planet Huse": { description: "WordPress-hjemmeside for en sommerhusbygger med mere end 37 års erfaring.", alt: "Skærmbillede af Planet Huses hjemmeside for sommerhusbyggeri" },
  "Planet Living": { description: "WordPress-hjemmeside for modulære tiny houses og haveværelser.", alt: "Skærmbillede af Planet Livings hjemmeside for tiny houses" },
  Forsia: { description: "Migrering fra Drupal til WordPress for dette danske forsikringsselskab, tidligere Sønderjysk Forsikring.", alt: "Skærmbillede af forsikringsselskabet Forsias hjemmeside" },
  Autocentralen: { description: "WordPress-vedligeholdelse og support for en stor dansk bilforhandler med flere afdelinger.", alt: "Skærmbillede af Autocentralens bilforhandlerhjemmeside" },
  Renell: {
    description: "WordPress-support for et svanemærket rengøringsselskab med mere end 700 medarbejdere og historie tilbage til 1987.",
    alt: "Skærmbillede af rengøringsselskabet Renells hjemmeside",
  },
  "Hørning Parket": { description: "WordPress-support for en 90 år gammel producent af premiumgulve målrettet arkitekter.", alt: "Skærmbillede af Hørning Parkets hjemmeside for parketgulve" },
  "BSI Marine Equipment Group": {
    description: "WordPress-hjemmeside for en marineudstyrsgruppe med ni specialiserede brands til sejlbåde og superyachter verden over.",
    alt: "Skærmbillede af BSI Marine Equipment Groups hjemmeside",
  },
  FIRKANT: {
    description: "Et hurtigt proceduregenereret platformspil, jeg lavede i GameMaker. Stram styring, øjeblikkelige genstarter og den helt rigtige 'bare ét forsøg mere'-følelse.",
    alt: "Skærmbillede af platformspillet FIRKANT med farverig pixelgrafik",
  },
  "Idle Game": {
    description: "En pastelfarvet PixiJS-prototype på et idle-spil med hoppende dyr, lokal lagring, butiksprogression og en bevidst hyggelig mobile-first-ramme.",
    alt: "Skærmbillede af Idle Game-eksperimentet med en pasteleng, dyresprites og HUD-elementer",
  },
  "Mord Ombord": {
    description: "Et VR-mordmysteriespil til Google Cardboard. Omfattende optimering for at ramme 60 fps på billige Android-telefoner.",
    alt: "Skærmbillede af VR-mordmysteriespillet Mord Ombord",
  },
  "Western World": {
    description: "Et Unity3D-miljø, der undersøger asset-pipelinen fra Maya til Unity. Støvede salooner og tumbleweeds er inkluderet.",
    alt: "Skærmbillede af 3D-miljøet Western World i Unity",
  },
  "Odense Golfklub": {
    description: "En Unity3D-mobilapp med 360-graders banebilleder og 3D-overflyvninger, bygget så klubbens medlemmer kan se hullerne før spillet.",
    alt: "Skærmbillede af Odense Golfklubs mobilapp med en golfbane i 3D",
  },
  "Torpedo Trump": {
    description: "Et satirisk game jam-bidrag, der fik tredjepladsen ved EAL Game Jam 2016. Lavet som en politisk parodi.",
    alt: "Skærmbillede af Torpedo Trump-spillet med glitch-præget præsidentgrafik",
  },
};

export function getProjects(locale: Locale): Project[] {
  if (locale === "en") return projects;

  return projects.map((project) => ({
    ...project,
    ...danishProjectCopy[project.title],
  }));
}
