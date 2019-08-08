// MixItUp
import mixitup from 'mixitup';

mixitup('#mixitup', {
    selectors: {
        target: '.mix'
    },
    animation: {
        duration: 400,
        nudge: true,
        // animateResizeContainer: false,
        effects: "fade translateZ(-100px)"
    }
});