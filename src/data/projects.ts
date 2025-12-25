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
