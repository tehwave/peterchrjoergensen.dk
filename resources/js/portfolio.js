var mixer = mixitup('#mixitup', {
	selectors: {
		target: '.project'
	},
	animation: {
		duration: 400,
		nudge: true,
		effects: "fade translateZ(-100px)"
	},
	callbacks: {
		onMixEnd: function() {
			jQuery(window).trigger('resize').trigger('scroll');
		}
	}
});

// Detect if positioned at top
function posTop() {
	return typeof window.pageYOffset != 'undefined' ? window.pageYOffset: document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop? document.body.scrollTop:0;
}

var page = $("html, body");

$("button").click(function() {
	page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
		page.stop();
	});

	if (!posTop()) {
		page.animate({ scrollTop: $("#mixitup").position().top - 120 }, 1500, function(){
			page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
		});
	};
});