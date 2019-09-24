const mix = require('laravel-mix');

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
    // CSS.
    .sass('resources/sass/bootstrap.scss', 'public/css')
    .sass('resources/sass/app.scss', 'public/css')

    // JS.
    .autoload({
        jquery: ['$', 'window.jQuery', 'jQuery'],
        'popper.js/dist/umd/popper.js': ['Popper']
    })
    .js('resources/js/bootstrap.js', 'public/js')
    .js('resources/js/mixitup.js', 'public/js')
    .js('resources/js/app.js', 'public/js')

    // JS Vendors.
    .extract()

    // Cache Busting.
    .version()

    // Options.
    .options({
        processCssUrls: false
    });
