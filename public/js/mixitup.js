(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/mixitup"],{

/***/ "./resources/js/mixitup.js":
/*!*********************************!*\
  !*** ./resources/js/mixitup.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// MixItUp
window.mixitup = __webpack_require__(/*! mixitup */ "./node_modules/mixitup/dist/mixitup.js");
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

/***/ }),

/***/ 1:
/*!***************************************!*\
  !*** multi ./resources/js/mixitup.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\tehwa\webdev\peterchrjoergensen.dk\resources\js\mixitup.js */"./resources/js/mixitup.js");


/***/ })

},[[1,"/js/manifest","/js/vendor"]]]);