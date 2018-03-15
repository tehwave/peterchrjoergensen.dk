let mix = require('laravel-mix');
require('laravel-mix-purgecss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    // CSS
    .sass('resources/assets/sass/bootstrap.scss', 'public/css')
    .sass('resources/assets/sass/app.scss', 'public/css')

    // JS
    .autoload({
        jquery: ['$', 'window.jQuery', 'jQuery'],
        'popper.js/dist/umd/popper.js': ['Popper']
    })
    .js('resources/assets/js/app.js', 'public/js')

    // JS Vendors
    .extract([
        'jquery-parallax.js',
        'bootstrap',
        'popper.js',
        'lazysizes',
        'mixitup', // Move this out of vendors and into specific file for portfolio page only?
        'jquery',
        'lodash',
        'axios' // Maybe we can remove this?
    ])

    // Clean up
    .purgeCss({
        whitelist: [
            'arrow',
            'lazyloaded',
            'tooltip-inner',
            'parallax-mirror',
            'mixitup-control-active'
        ]
    })

    // Cache Busting
    .version();
