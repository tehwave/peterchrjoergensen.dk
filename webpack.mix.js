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
    .js('resources/assets/js/mixitup.js', 'public/js')

    // JS Vendors
    .extract([
        'jquery-parallax.js',
        'bootstrap',
        'popper.js',
        'lazysizes',
        'jquery',
    ])

    // Clean up
    .purgeCss({
        whitelist: [
            'arrow',
            'collapsing',
            'lazyloaded',
            'tooltip-inner',
            'bs-tooltip-top',
            'bs-tooltip-auto',
            'bs-tooltip-left',
            'parallax-mirror',
            'bs-tooltip-right',
            'bs-tooltip-bottom',
            'mixitup-control-active'
        ]
    })

    // Cache Busting
    .version();
