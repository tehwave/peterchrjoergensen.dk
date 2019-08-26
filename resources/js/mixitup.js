// MixItUp
window.mixitup = require('mixitup');

var mixer = mixitup(document.querySelector('#mixitup'), {
    selectors: {
        target: '.mix'
    },
    animation: {
        duration: 400,
        animateResizeContainer: false,
        effects: "fade translateZ(-100px)"
    },
    load: {
        sort: 'random'
    }
});
