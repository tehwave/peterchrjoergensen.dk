import type { Project } from "../types";

// Import project images for Astro optimization
import janchartImg from "../assets/projects/janchart.png";
import grundfosImg from "../assets/projects/grundfos.png";
import firkantImg from "../assets/projects/firkant.png";
import gm48Img from "../assets/projects/gm48.png";
import websiteImg from "../assets/projects/website.png";
import showreelImg from "../assets/projects/showreel.jpg";
import authorImg from "../assets/projects/author.jpg";
import odensegolfklubImg from "../assets/projects/odensegolfklub.png";
import b2bkoldingImg from "../assets/projects/b2bkolding.png";
import westernImg from "../assets/projects/western.jpg";
import mordombordImg from "../assets/projects/mordombord.png";
import lennarthansenImg from "../assets/projects/lennarthhansen.png";

/**
 * Portfolio projects displayed on the homepage.
 * Each project includes metadata for rendering ProjectCard components.
 */
export const projects: Project[] = [
  {
    title: "Janchart",
    description:
      "I built the website in Laravel, Bootstrap and jQuery for this chartering, shipping, and shipowners company.",
    alt: "Screenshot of the Janchart shipping company website homepage",
    tags: ["Laravel", "Bootstrap", "jQuery"],
    image: janchartImg,
  },
  {
    title: "Grundfos Safety",
    description:
      "A gamified quiz web application made in Vue.js with legacy browser support, teaching safety protocols at Grundfos.",
    alt: "Screenshot of the Grundfos Safety quiz application interface",
    tags: ["Vue.js", "JavaScript", "Gamification"],
    image: grundfosImg,
  },
  {
    title: "FIRKANT",
    description:
      "A fun, challenging platformer video game made in GameMaker Studio. Fast-paced procedural platforming action.",
    alt: "Screenshot of FIRKANT platformer game showing colorful pixel graphics",
    tags: ["GameMaker", "Game Design"],
    image: firkantImg,
  },
  {
    title: "gm48.net",
    description:
      "I built the website using Laravel, Bootstrap and jQuery for this game jam community with thousands of participants.",
    alt: "Screenshot of gm48.net game jam website homepage",
    tags: ["Laravel", "PHP", "jQuery"],
    image: gm48Img,
    link: "https://gm48.net",
  },
  {
    title: "This Website",
    description:
      "Built with Astro, TypeScript and SCSS — with AI assistance for component structure and styling decisions.",
    alt: "Screenshot of my personal portfolio website",
    tags: ["Astro", "TypeScript", "SCSS"],
    image: websiteImg,
  },
  {
    title: "Showreel – 2015",
    description:
      "Edited in Premiere Pro with careful attention to music synchronization, showcasing various creative projects.",
    alt: "Still frame from my 2015 video showreel",
    tags: ["Premiere Pro", "Video Editing"],
    image: showreelImg,
  },
  {
    title: "The Author",
    description:
      "I starred in this short film as the main character and handled color grading and editing in Adobe Premiere Pro.",
    alt: "Still frame from The Author short film",
    tags: ["Acting", "Premiere Pro", "Color Grading"],
    image: authorImg,
  },
  {
    title: "Odense Golfklub",
    description:
      "A mobile application built in Unity3D featuring 360° imagery and 3D models of golf courses for club members.",
    alt: "Screenshot of Odense Golfklub mobile app showing 3D golf course",
    tags: ["Unity3D", "3D", "Mobile"],
    image: odensegolfklubImg,
  },
  {
    title: "B2B Kolding",
    description:
      "I developed a custom WordPress theme with performance optimization, SEO and analytics integration.",
    alt: "Screenshot of B2B Kolding business network website",
    tags: ["WordPress", "PHP", "SEO"],
    image: b2bkoldingImg,
  },
  {
    title: "Western World",
    description:
      "A Unity3D school project exploring the asset pipeline between Maya and the game engine.",
    alt: "Screenshot of Western World 3D environment in Unity",
    tags: ["Unity3D", "Maya", "3D"],
    image: westernImg,
  },
  {
    title: "Mord Ombord",
    description:
      "A Google Cardboard VR game built in Unity3D, heavily optimized to run smoothly on older mobile devices.",
    alt: "Screenshot of Mord Ombord VR murder mystery game",
    tags: ["Unity3D", "C#", "VR"],
    image: mordombordImg,
  },
  {
    title: "Lennart H. Hansen",
    description:
      "A professional website showcasing their construction and renovation services.",
    alt: "Screenshot of Lennart H. Hansen company website",
    tags: ["Web Development", "Design"],
    image: lennarthansenImg,
  },
];
