<?php ?>
<!DOCTYPE html>
<html class="no-js" lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Portfolio – Peter C. Jørgensen</title>

		<!--
			  ____      _               ____         _
			 |  _ \ ___| |_ ___ _ __   / ___|       | | ____  _ __ __ _  ___ _ __  ___  ___ _ __
			 | |_) / _ \ __/ _ \ '__| | |        _  | |/ _//\| '__/ _` |/ _ \ '_ \/ __|/ _ \ '_ \
			 |  __/  __/ ||  __/ |    | |___ _  | |_| | (//) | | | (_| |  __/ | | \__ \  __/ | | |
			 |_|   \___|\__\___|_|     \____(_)  \___/ \//__/|_|  \__, |\___|_| |_|___/\___|_| |_|
																  |___/
										Designed and developed by
							Peter C. Jørgensen | peterchrjoergensen.dk | @tehwave
		 -->

		<!-- SEO -->
		<meta name="robots" content="index, follow">
		<meta name="title" content="Portfolio">
		<meta name="author" content="Peter C. Jørgensen">
		<meta name="description" content="Peter C. Jørgensen's Portfolio">

		<!-- Favicon -->
		<link rel="manifest" href="/manifest.json">
		<meta name="theme-color" content="#0fa0ce">
		<link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#5bbad5">
		<link rel="apple-touch-icon" sizes="144x144" href="/img/apple-touch-icon.png">
		<link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16">

		<!-- Open Graph -->
		<meta property="og:type" content="profile">
		<meta property="profile:first_name" content="Peter">
		<meta property="profile:last_name" content="Jørgensen">
		<meta property="og:title" content="Portfolio">
		<meta property="og:url" content="https://peterchrjoergensen.dk">
		<meta property="og:image" content="https://peterchrjoergensen.dk/img/peter.jpg">
		<meta property="og:description" content="Peter C. Jørgensen's Portfolio">

		<!-- Twitter -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@tehwave">
		<meta name="twitter:title" content="Portfolio">
		<meta name="twitter:description" content="Peter C. Jørgensen's Portfolio">

		<!-- JSON-LD Person -->
		<script type="application/ld+json" defer>
		{
		  "@context": "http://schema.org/",
		  "@type": "Person",
		  "name": "Peter C. Jørgensen",
		  "jobTitle": "Multimedia Designer",
		  "address": {
			"@type": "PostalAddress",
			"addressLocality": "Kolding",
			"addressRegion": "Jutland"
		  }
		}
		</script>

		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="/css/normalize.css">
		<link rel="stylesheet" type="text/css" href="/css/skeleton.css">
		<link rel="stylesheet" type="text/css" href="/css/pcj.min.css">

		<!-- Font -->
		<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Raleway:700,600,400,300'>

		<!-- Google Tag Manager -->
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-TKNTXKZ');</script>
		<!-- End Google Tag Manager -->

		<!-- JavaScript Enabled Check -->
		<script type="text/javascript">
			document.documentElement.className = document.documentElement.className.replace("no-js","js");
		</script>
	</head>
	<!-- neck -->
	<body class="portfolio u-full-width">
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TKNTXKZ"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->

		<!-- Header -->
		<?php
			require_once('../header.php');
		?>

		<!-- Main -->
		<main class="u-full-width">
			<!-- Introduction -->
			<section class="parallax intro" data-parallax="scroll" data-speed="0.6" data-image-src="img/portfolio.jpg" data-natural-width="1920" data-natural-height="1080" data-z-index="0">
				<div class="container">
					<h2>Portfolio</h2>
					<p>Throughout the years, I have accumulated various <b>ambitious</b> <b>and creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
					<p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
				</div>
			</section>

			<!-- Projects -->
			<section class="projects text-center">
				<ul class="controls">
					<li><button type="button" class="button" data-filter="all">All</a></li>
					<li><button type="button" class="button" data-filter=".game">Game</a></li>
					<li><button type="button" class="button" data-filter=".video">Video</a></li>
					<li><button type="button" class="button" data-filter=".website">Website</a></li>
					<li><button type="button" class="button" data-filter=".application">Application</a></li>
					<li><button type="button" class="button" data-filter=".solo">Solo</a></li>
					<li><button type="button" class="button" data-filter=".team">Team</a></li>
					<li><button type="button" class="button" data-filter=".company">Company</a></li>
				</ul>
				<div class="container" id="mixitup">
					<hr>
					<article class="project game solo">
						<img class="image u-max-full-width" src="img/firkant.png" alt="FIRKANT">
						<h2 class="title">FIRKANT</h2>
						<hr>
						<ul class="tags">
							<li>Game</li>
							<li>GameMaker: Studio</li>
							<li>Solo</li>
						</ul>
						<p class="lead">FIRKANT is a a fast-paced, procedural platformer inspired by Cloudberry Kingdom and Super Meat Boy.</p>
						<p>Made in GameMaker: Studio, it's planned for release on mobile platforms in late 2017. For more information, please visit the website.</p>
						<div><a class="button button-primary" href="/FIRKANT" target="_blank" rel="noopener">Check it out</a></div>
					</article>
					<article class="project website company">
						<img class="image u-max-full-width" src="img/b2bkolding.png" alt="B2B Kolding">
						<h2 class="title">B2B Kolding</h2>
						<hr>
						<ul class="tags">
							<li>Website</li>
							<li>Wordpress</li>
							<li>Company</li>
						</ul>
						<p class="lead">B2B Kolding aims to strengthen the partnership between local businesses in Kolding, Denmark.</p>
						<p>Using Wordpress as CMS, I developed a custom-built theme for the website, and optimized it with cache, SEO and analytics plugins.</p>
						<div><a class="button button-primary" href="https://www.b2bkolding.dk" target="_blank" rel="noopener">Check it out</a></div>
					</article>
					<article class="project website solo">
						<img class="image u-max-full-width" src="img/gm48.png" alt="gm(48)">
						<h2 class="title">GM48</h2>
						<hr>
						<ul class="tags">
							<li>Website</li>
							<li>Laravel</li>
							<li>Solo</li>
						</ul>
						<p class="lead">The gm(48) is a quarterly 48 hours GameMaker game jam from the community of /r/GameMaker.</p>
						<p>I wrote the website in PHP, HTML, SASS and JS using the Laravel, Bootstrap and VueJS frameworks.</p>
						<div><a class="button button-primary" href="https://gm48.net" target="_blank" rel="noopener">Check it out</a></div>
					</article>
					<article class="project website company">
						<img class="image u-max-full-width" src="img/grundfos.png" alt="Grundfos">
						<h2 class="title">Grundfos Safety</h2>
						<hr>
						<ul class="tags">
							<li>Website</li>
							<li>VueJS</li>
							<li>Company</li>
						</ul>
						<p class="lead">A safety instructions and quiz web application for visitors to the Grundfos facilities.</p>
						<p>The web application was written in VueJS, and has editable files, translation and support for browsers IE9+.</p>
						<div><a class="button button-primary" href="https://tehwave.github.io/grundfos-quiz/" target="_blank" rel="noopener">Check it out</a></div>
					</article>
					<article class="project video team">
						<img class="image u-max-full-width" src="img/author.jpg" alt="The Author">
						<h2 class="title">The Author</h2>
						<hr>
						<ul class="tags">
							<li>Video</li>
							<li>Premiere Pro</li>
							<li>Team</li>
						</ul>
						<p class="lead">
							An author with writer's block goes to an abandoned house for inspiration, but find things getting too real.
						</p>
						<p>
							I starred in the short film as the main character. It was colorgraded and edited in Adobe Premiere Pro by me as well.
						</p>
						<div>
							<a class="button button-primary" href="https://www.youtube.com/watch?v=S0bQYYnhtGk" target="_blank" rel="noopener">Watch it</a>
						</div>
					</article>
					<article class="project game team">
						<img class="image u-max-full-width" src="img/western.jpg" alt="Western World">
						<h2 class="title">Western World</h2>
						<hr>
						<ul class="tags">
							<li>Game</li>
							<li>Unity3D</li>
							<li>Team</li>
						</ul>
						<p class="lead">
							A small, atmospheric town, that was inspired by the good, old Western films, to explore around in.
						</p>
						<p>
							Made in Unity3D as a school project, it was meant to teach us the asset pipeline between Maya and Unity.
						</p>
						<div>
							<a class="button button-primary" href="https://www.youtube.com/watch?v=0SeTUIsS5sQ" target="_blank" rel="noopener">Watch trailer</a>
						</div>
					</article>
					<article class="project video solo">
						<img class="image u-max-full-width" src="img/showreel.jpg" alt="Showreel">
						<h2 class="title">Showreel - 2015</h2>
						<hr>
						<ul class="tags">
							<li>Video</li>
							<li>Premiere Pro</li>
							<li>Solo</li>
						</ul>
						<p class="lead">
							A showreel for various school projects that I completed during my first two semesters in 2015.
						</p>
						<p>
							Edited in Premiere Pro, it was important for me that the music matched the editing, so that it was exciting to watch.
						</p>
						<div>
							<a class="button button-primary" href="https://www.youtube.com/watch?v=cYLeWeJryOQ" target="_blank" rel="noopener">Watch it</a>
						</div>
					</article>
					<article class="project website solo">
						<img class="image u-max-full-width" src="img/website.png" alt="Website">
						<h2 class="title">My Website</h2>
						<hr>
						<ul class="tags">
							<li>Website</li>
							<li>HTML / CSS / JS</li>
							<li>Solo</li>
						</ul>
						<p class="lead">
							My personal website complete with landing page, portfolio, curriculum vitae and blog.
						</p>
						<p>
							I wrote the website to be static and fast using plain HTML, CSS and JS. I used MixItUp 3 for projects display & filtering.
						</p>
						<div>
							<a class="button button-primary" href="https://github.com/tehwave/peterchrjoergensen.dk" target="_blank" rel="noopener">Browse code</a>
						</div>
					</article>
					<article class="project game team">
						<img class="image u-max-full-width" src="img/mordombord.png" alt="Mord Ombord">
						<h2 class="title">Mord Ombord</h2>
						<hr>
						<ul class="tags">
							<li>Game</li>
							<li>Unity3D</li>
							<li>Team</li>
						</ul>
						<p class="lead">
							Solve mysteries and puzzles in Virtual Reality as part of your base school education
						</p>
						<p>
							Developed in Unity3D for use with Google Cardboard, I had to heavily optimize the game to run on old devices.
						</p>
						<div>
							<a class="button button-primary" href="https://www.youtube.com/watch?v=0U42shiUG2w" target="_blank" rel="noopener">Watch trailer</a>
						</div>
					</article>
					<article class="project application team">
						<img class="image u-max-full-width" src="img/odensegolfklub.png" alt="Odense Golfklub">
						<h2 class="title">Odense Golfklub</h2>
						<hr>
						<ul class="tags">
							<li>Game</li>
							<li>Unity3D</li>
							<li>Team</li>
						</ul>
						<p class="lead">
							A mobile application for the members of Odense Golfklub with 360° imagery and 3D models of golf courses.
						</p>
						<p>
							Developed in Unity3D for its ease with 3D, I had to write custom functionality to handle the display of 360° imagery.
						</p>
						<div>
							<a class="button button-primary" href="files/OdenseGolfklub.apk" target="_blank" rel="noopener">Download APK</a>
						</div>
					</article>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<?php
			require_once('../footer.php');
		?>

		<!-- JS -->
		<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
		<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.12.4.min.js"><\/script>')</script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.4/SmoothScroll.min.js" defer></script>
		<script src="/js/parallax.min.js" defer></script>

		<!-- MixitUp -->
		<script src="/js/mixitup.min.js"></script>
		<script type="text/javascript">
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
		</script>
	</body>
</html>