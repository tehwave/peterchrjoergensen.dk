// MixItUp
window.mixitup = require('mixitup');

var mixer = mixitup(document.querySelector('#mixitup'), {
    selectors: {
        target: '.mix',
        control: '[data-filter]'
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
