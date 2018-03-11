
/**
 * First, we will load all of this project's Javascript utilities and other
 * dependencies. Then, we will be ready to develop a robust and powerful
 * application frontend using useful Laravel and JavaScript libraries.
 */

require('./bootstrap');


// MixItUp
import mixitup from 'mixitup';

if (document.querySelector('#mixitup')) {
    var mixer = mixitup('#mixitup', {
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
}

// Tooltip
$('[data-toggle="tooltip"]').tooltip();
