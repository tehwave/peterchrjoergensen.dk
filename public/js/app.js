webpackJsonp([1],{

/***/ "./resources/assets/js/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mixitup__ = __webpack_require__("./node_modules/mixitup/dist/mixitup.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mixitup___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mixitup__);

/**
 * First, we will load all of this project's Javascript utilities and other
 * dependencies. Then, we will be ready to develop a robust and powerful
 * application frontend using useful Laravel and JavaScript libraries.
 */

__webpack_require__("./resources/assets/js/bootstrap.js");

// MixItUp

var mixer = __WEBPACK_IMPORTED_MODULE_0_mixitup___default()('#mixitup', {
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

/***/ }),

/***/ "./resources/assets/js/bootstrap.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_popper_js_dist_umd_popper_js__ = __webpack_require__("./node_modules/popper.js/dist/umd/popper.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_popper_js_dist_umd_popper_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_popper_js_dist_umd_popper_js__);

window._ = __webpack_require__("./node_modules/lodash/lodash.js");

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
  window.$ = __webpack_provided_window_dot_jQuery = __webpack_require__("./node_modules/jquery/dist/jquery.js");
  window.Popper = __WEBPACK_IMPORTED_MODULE_0_popper_js_dist_umd_popper_js___default.a;
  __webpack_require__("./node_modules/bootstrap/dist/js/bootstrap.js");
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__("./node_modules/axios/index.js");

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./resources/assets/sass/app.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./resources/assets/js/app.js");
module.exports = __webpack_require__("./resources/assets/sass/app.scss");


/***/ })

},[0]);