/**
 * First, we will load all of this project's Javascript utilities and other
 * dependencies. Then, we will be ready to develop a robust and powerful
 * application frontend using useful Laravel and JavaScript libraries.
 */

$(document).ready(function() {
    // Tooltip.
    $('[data-tooltip]').tooltip();

    // Lazy loading.
    $('[data-lazy]').lazy({
        effect: "fadeIn",
        effectTime: 500
    });
});