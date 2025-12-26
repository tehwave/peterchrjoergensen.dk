import type { Project } from "../types";

// Import project images for Astro optimization
import janchartImg from "../assets/projects/janchart.png";
import grundfosImg from "../assets/projects/grundfos.png";
import firkantImg from "../assets/projects/firkant.png";
import gm48Img from "../assets/projects/gm48.png";
import websiteImg from "../assets/projects/website.png";
import odensegolfklubImg from "../assets/projects/odensegolfklub.png";
import westernImg from "../assets/projects/western.jpg";
import mordombordImg from "../assets/projects/mordombord.png";

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

/**
 * Portfolio projects displayed on the homepage.
 * Each project includes metadata for rendering ProjectCard components.
 */
export const projects: Project[] = [
  // === WEB DEVELOPMENT ===
  {
    title: "Janchart",
    description:
      "I built the website in Laravel, Bootstrap and jQuery for this chartering, shipping, and shipowners company.",
    alt: "Screenshot of the Janchart shipping company website homepage",
    tags: ["Laravel", "Bootstrap", "jQuery"],
    image: janchartImg,
    link: "https://janchart.dk",
    category: "web",
  },
  {
    title: "Grundfos Safety",
    description:
      "A gamified quiz web application made in Vue.js with legacy browser support, teaching safety protocols at Grundfos.",
    alt: "Screenshot of the Grundfos Safety quiz application interface",
    tags: ["Vue.js", "JavaScript", "Gamification"],
    image: grundfosImg,
    link: "https://tehwave.github.io/grundfos-quiz/",
    category: "web",
  },
  {
    title: "gm48.net",
    description:
      "The home of a game jam community I've run since 2013. Built with Laravel — over 50 jams hosted and thousands of games submitted.",
    alt: "Screenshot of gm48.net game jam website homepage",
    tags: ["Laravel", "PHP", "Community"],
    image: gm48Img,
    link: "https://gm48.net",
    category: "web",
  },
  {
    title: "This Website",
    description:
      "Built with Astro, TypeScript and SCSS — with AI assistance for component structure and styling decisions.",
    alt: "Screenshot of my personal portfolio website",
    tags: ["Astro", "TypeScript", "SCSS"],
    image: websiteImg,
    link: "https://github.com/tehwave/peterchrjoergensen.dk",
    category: "web",
  },

  // === CLIENT PROJECTS ===
  {
    title: "Solgt.com",
    description:
      "Tech lead for Denmark's leading car sales platform. Full-stack development across WordPress and Laravel.",
    alt: "Screenshot of Solgt.com car sales platform homepage",
    tags: ["Laravel", "WordPress", "E-commerce"],
    image: solgtImg,
    link: "https://solgt.com",
    category: "web",
  },
  {
    title: "VillaVilla",
    description:
      "Senior web developer and tech lead for a luxury vacation rental company. Full-stack WordPress and Laravel.",
    alt: "Screenshot of VillaVilla luxury vacation rental website",
    tags: ["Laravel", "WordPress", "E-commerce"],
    image: villavillaImg,
    link: "https://villavilla.dk",
    category: "web",
  },
  {
    title: "DM Greenkeeping",
    description:
      "Built the Laravel CRM and quote system that now supports this multi-million lawn care business.",
    alt: "Screenshot of DM Greenkeeping lawn care service website",
    tags: ["Laravel", "CRM", "E-commerce"],
    image: dmgreenkeepingImg,
    link: "https://dmgreenkeeping.dk",
    category: "web",
  },
  {
    title: "Restudy",
    description:
      "Learning CMS platform with WordPress frontend and Laravel backend. Denmark's largest video education portal.",
    alt: "Screenshot of Restudy video education platform",
    tags: ["Laravel", "WordPress", "Education"],
    image: restudyImg,
    link: "https://restudy.dk",
    category: "web",
  },
  {
    title: "Kirppu",
    description:
      "Denmark's largest secondhand chain. AI-powered image analysis for product categorization.",
    alt: "Screenshot of Kirppu secondhand marketplace website",
    tags: ["WordPress", "AI", "E-commerce"],
    image: kirppuImg,
    link: "https://kirppu.dk",
    category: "web",
  },
  {
    title: "SkiOutlet",
    description:
      "WordPress webshop with thousands of SKUs imported from Microsoft NAV. Denmark's largest ski outlet.",
    alt: "Screenshot of SkiOutlet ski equipment webshop",
    tags: ["WordPress", "WooCommerce", "E-commerce"],
    image: skioutletImg,
    link: "https://skioutlet.nu",
    category: "web",
  },
  {
    title: "Slagter Lampe",
    description:
      "WordPress webshop for a traditional family butcher since 1939. Famous for their award-winning sausages.",
    alt: "Screenshot of Slagter Lampe butcher webshop",
    tags: ["WordPress", "WooCommerce", "E-commerce"],
    image: slagterlampeImg,
    link: "https://slagterlampe.dk",
    category: "web",
  },
  {
    title: "AutoProff",
    description:
      "Laravel developer support for this B2B car trading platform operating in 12 European markets.",
    alt: "Screenshot of AutoProff B2B car trading platform",
    tags: ["Laravel", "B2B", "Automotive"],
    image: autoproffImg,
    link: "https://www.autoproff.dk",
    category: "web",
  },
  {
    title: "Planet Huse",
    description:
      "WordPress website for a summer house builder with 37+ years of experience.",
    alt: "Screenshot of Planet Huse summer house builder website",
    tags: ["WordPress", "Construction"],
    image: planetHuseImg,
    link: "https://planet-huse.dk",
    category: "web",
  },
  {
    title: "Planet Living",
    description:
      "WordPress website for modular tiny houses and garden rooms.",
    alt: "Screenshot of Planet Living tiny house website",
    tags: ["WordPress", "Construction"],
    image: planetLivingImg,
    link: "https://planet-living.dk",
    category: "web",
  },
  {
    title: "Forsia",
    description:
      "Drupal to WordPress migration for this Danish insurance company (formerly Sønderjysk Forsikring).",
    alt: "Screenshot of Forsia insurance company website",
    tags: ["WordPress", "Migration", "Insurance"],
    image: forsiaImg,
    link: "https://forsia.dk",
    category: "web",
  },
  {
    title: "Autocentralen",
    description:
      "WordPress maintenance and support for a major Danish car dealer with multiple locations.",
    alt: "Screenshot of Autocentralen car dealer website",
    tags: ["WordPress", "Automotive"],
    image: autocentralenImg,
    link: "https://www.autocentralen.com",
    category: "web",
  },
  {
    title: "Renell",
    description:
      "WordPress support for a Swan-certified cleaning company with 700+ employees since 1987.",
    alt: "Screenshot of Renell cleaning company website",
    tags: ["WordPress", "Facility Services"],
    image: renellImg,
    link: "https://www.renell.dk",
    category: "web",
  },
  {
    title: "Hørning Parket",
    description:
      "WordPress support for a 90-year-old premium flooring manufacturer targeting architects.",
    alt: "Screenshot of Hørning Floor parquet flooring website",
    tags: ["WordPress", "Manufacturing"],
    image: horningfloorImg,
    link: "https://www.horningfloor.dk",
    category: "web",
  },

  // === GAME DEVELOPMENT ===
  {
    title: "FIRKANT",
    description:
      "A fast-paced procedural platformer I made in GameMaker. Tight controls, instant restarts, and that 'one more try' feeling.",
    alt: "Screenshot of FIRKANT platformer game showing colorful pixel graphics",
    tags: ["GameMaker", "Game Design", "Procedural"],
    image: firkantImg,
    link: "https://firkant.website",
    category: "games",
  },
  {
    title: "Mord Ombord",
    description:
      "A murder mystery VR game for Google Cardboard. Heavy optimization work to hit 60fps on budget Android phones.",
    alt: "Screenshot of Mord Ombord VR murder mystery game",
    tags: ["Unity3D", "C#", "VR"],
    image: mordombordImg,
    link: "https://www.youtube.com/watch?v=0U42shiUG2w",
    category: "games",
  },
  {
    title: "Western World",
    description:
      "A Unity3D environment exploring the Maya-to-Unity asset pipeline. Dusty saloons and tumbleweeds included.",
    alt: "Screenshot of Western World 3D environment in Unity",
    tags: ["Unity3D", "Maya", "3D Art"],
    image: westernImg,
    link: "https://www.youtube.com/watch?v=0SeTUIsS5sQ",
    category: "games",
  },
  {
    title: "Odense Golfklub",
    description:
      "A Unity3D mobile app with 360° course imagery and 3D flyovers. Built for club members to preview holes before playing.",
    alt: "Screenshot of Odense Golfklub mobile app showing 3D golf course",
    tags: ["Unity3D", "3D", "Mobile"],
    image: odensegolfklubImg,
    category: "games",
  },
];
