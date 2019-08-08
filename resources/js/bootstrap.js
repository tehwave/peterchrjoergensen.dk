import Popper from 'popper.js/dist/umd/popper.js';

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');

    window.Popper = Popper;

    require('bootstrap');

    require('jquery-lazy');

} catch (e) {

}
