/**
 * Shared view transition animations for consistent page navigation effects
 */

/**
 * Fade animation: fade out down → fade in up
 * Used for blog pages to create a smooth downward/upward transition effect
 */
export const fadeAnimation = {
  forwards: {
    old: [
      {
        name: "fadeOutDown",
        duration: "0.3s",
        easing: "ease-in",
        fillMode: "forwards",
      },
    ],
    new: [
      {
        name: "fadeInUp",
        duration: "0.4s",
        easing: "ease-out",
        fillMode: "backwards",
        delay: "0.3s",
      },
    ],
  },
  backwards: {
    old: [
      {
        name: "fadeOutDown",
        duration: "0.3s",
        easing: "ease-in",
        fillMode: "forwards",
      },
    ],
    new: [
      {
        name: "fadeInUp",
        duration: "0.4s",
        easing: "ease-out",
        fillMode: "backwards",
        delay: "0.3s",
      },
    ],
  },
};
