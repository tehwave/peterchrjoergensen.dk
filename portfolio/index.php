<?php

$projects = array(
	"B2B Kolding" => array(
		"filters" => array("website", "company"),
		"image" => "b2bkolding",
		"image_format" => "png",
		"title" => "B2B Kolding",
		"tags" => array("Website", "Wordpress", "Company"),
		"lead" => "B2B Kolding aims to strengthen the partnership between local businesses in Kolding, Denmark.",
		"paragraph" => "Using Wordpress as CMS, I developed a custom-built theme for the website, and optimized it with cache, SEO and analytics plugins.",
		"button_text" => "Check it out",
		"button_url" => "https://www.b2bkolding.dk"
	),
	"GM48" => array(
		"filters" => array("website", "solo"),
		"image" => "gm48",
		"image_format" => "png",
		"title" => "GM48",
		"tags" => array("Website", "PHP", "Solo"),
		"lead" => "The gm(48) is a quarterly 48 hours GameMaker game jam from the community of /r/GameMaker.",
		"paragraph" => "I wrote the website in PHP, HTML, SASS and JS using the Laravel, Bootstrap and VueJS frameworks.",
		"button_text" => "Check it out",
		"button_url" => "https://gm48.net"
	),
	"Grundfos Safety" => array(
		"filters" => array("website", "company"),
		"image" => "grundfos",
		"image_format" => "png",
		"title" => "Grundfos Safety",
		"tags" => array("Website", "JavaScript", "Company"),
		"lead" => "A safety instructions and quiz web application for visitors to the Grundfos facilities.",
		"paragraph" => "The web application was written in VueJS, and has editable files, translations and support for browsers from IE9 and up.",
		"button_text" => "Check it out",
		"button_url" => "https://tehwave.github.io/grundfos-quiz/"
	),
	"My Website" => array(
		"filters" => array("website", "solo"),
		"image" => "website",
		"image_format" => "png",
		"title" => "My Website",
		"tags" => array("Website", "HTML / CSS / JS", "Solo"),
		"lead" => "My personal website complete with landing page, portfolio, curriculum vitae and blog.",
		"paragraph" => "I wrote the website to be static and fast using plain HTML, CSS and JS. I used MixItUp 3 for display & filtering of projects.",
		"button_text" => "Browse code",
		"button_url" => "https://github.com/tehwave/peterchrjoergensen.dk"
	),
	"FIRKANT" => array(
		"filters" => array("game", "solo"),
		"image" => "firkant",
		"image_format" => "png",
		"title" => "FIRKANT",
		"tags" => array("Game", "GameMaker: Studio", "Solo"),
		"lead" => "FIRKANT is a a fast-paced, procedural platformer inspired by Cloudberry Kingdom and Super Meat Boy.",
		"paragraph" => "Made in GameMaker: Studio, it's planned for release on mobile platforms in late 2017. For more information, please visit the website.",
		"button_text" => "Check it out",
		"button_url" => "/FIRKANT"
	),
	"The Author" => array(
		"filters" => array("video", "team"),
		"image" => "author",
		"image_format" => "jpg",
		"title" => "The Author",
		"tags" => array("Video", "Premiere Pro", "Team"),
		"lead" => "An author with writer's block goes to an abandoned house for inspiration, but find things getting too real.",
		"paragraph" => "I starred in the short film as the main character. It was colorgraded and edited in Adobe Premiere Pro by me as well.",
		"button_text" => "Watch it",
		"button_url" => "https://www.youtube.com/watch?v=S0bQYYnhtGk"
	),
	"Western World" => array(
		"filters" => array("application", "team"),
		"image" => "western",
		"image_format" => "jpg",
		"title" => "Western World",
		"tags" => array("Application", "Unity3D", "Team"),
		"lead" => "A small, atmospheric town, that was inspired by the good, old Western films, to explore around in.",
		"paragraph" => "Made in Unity3D as a school project, it was meant to teach us the asset pipeline between Maya and Unity.",
		"button_text" => "Watch the trailer",
		"button_url" => "https://www.youtube.com/watch?v=0SeTUIsS5sQ"
	),
	"Showreel - 2015" => array(
		"filters" => array("video", "solo"),
		"image" => "showreel",
		"image_format" => "jpg",
		"title" => "Showreel - 2015",
		"tags" => array("Video", "Premiere Pro", "Solo"),
		"lead" => "A showreel for various school projects that I completed during my first two semesters in 2015.",
		"paragraph" => "Edited in Premiere Pro, it was important for me that the music matched the editing, so that it was exciting to watch.",
		"button_text" => "Watch it",
		"button_url" => "https://www.youtube.com/watch?v=cYLeWeJryOQ"
	),
	"Mord Ombord" => array(
		"filters" => array("game", "team"),
		"image" => "mordombord",
		"image_format" => "png",
		"title" => "Mord Ombord",
		"tags" => array("Game", "Unity3D", "Team"),
		"lead" => "Solve mysteries and puzzles using learning material in Virtual Reality as part of your school education.",
		"paragraph" => "Developed in Unity3D for use with Google Cardboard, I had to heavily optimize the game to run on old devices.",
		"button_text" => "Watch trailer",
		"button_url" => "https://www.youtube.com/watch?v=0U42shiUG2w"
	),
	"Odense Golfklub" => array(
		"filters" => array("application", "team"),
		"image" => "odensegolfklub",
		"image_format" => "png",
		"title" => "Odense Golfklub",
		"tags" => array("Application", "Unity3D", "Team"),
		"lead" => "A mobile application for the members of Odense Golfklub with 360° imagery and 3D models of golf courses.",
		"paragraph" => "Developed in Unity3D for its ease with 3D, I had to write custom functionality to handle the display of 360° imagery.",
		"button_text" => "Download APK",
		"button_url" => "files/OdenseGolfklub.apk"
	),
);


?>
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
		<link rel="stylesheet" type="text/css" href="/css/normalize.min.css">
		<link rel="stylesheet" type="text/css" href="/css/skeleton.min.css">
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
			<section
				class="parallax intro"
				data-parallax="scroll"
				data-speed="0.6"
				data-image-src="img/portfolio.jpg"
				data-natural-width="1920"
				data-natural-height="1080"
				data-z-index="0"
			>
				<div class="container">
					<h2>Portfolio</h2>
					<p>Throughout the years, I have accumulated various <b>ambitious</b> <b>and creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
					<p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
				</div>
			</section>

			<!-- Projects -->
			<section class="projects text-center">
				<ul class="controls">
					<li><button type="button" class="button" data-filter="all">All</button></li>
					<li><button type="button" class="button" data-filter=".game">Game</button></li>
					<li><button type="button" class="button" data-filter=".video">Video</button></li>
					<li><button type="button" class="button" data-filter=".website">Website</button></li>
					<li><button type="button" class="button" data-filter=".application">Application</button></li>
					<li><button type="button" class="button" data-filter=".solo">Solo</button></li>
					<li><button type="button" class="button" data-filter=".team">Team</button></li>
					<li><button type="button" class="button" data-filter=".company">Company</button></li>
				</ul>
				<div class="container" id="mixitup">
					<hr>
					<?php foreach ($projects as $project): ?>
						<article class="project <?php echo implode(" ", $project['filters']) ?>">
							<noscript>
								<img
									class="u-max-full-width image"
									src="img/<?php echo $project['image'] .".". $project['image_format'] ?>"
									width="300" height="300" alt="<?php echo $project['title'] ?>"
								/>
							</noscript>
							<img
								class="u-max-full-width image lazyload lqip"
								src="img/<?php echo $project['image'] ?>-lowquality.<?php echo $project['image_format'] ?>"
								data-src="img/<?php echo $project['image'] .".". $project['image_format'] ?>"
								width="300" height="300" alt="<?php echo $project['title'] ?>"
							/>
							<section>
								<h2 class="title">
									<?php echo $project['title'] ?>
								</h2>
								<hr>
								<ul class="tags">
									<?php
										foreach ($project['tags'] as $tag) {
											echo "<li>". $tag ."</li>\r\n";
										}
									?>
								</ul>
								<p class="lead">
									<?php echo $project['lead'] ?>
								</p>
								<p>
									<?php echo $project['paragraph'] ?>
								</p>
								<a class="button button-primary" href="<?php echo $project['button_url'] ?>" target="_blank" rel="noopener">
									<?php echo $project['button_text'] ?>
								</a>
							</section>
						</article>
					<?php endforeach; ?>
				</div>
			</section>
		</main>

		<!-- Footer -->
		<?php
			require_once('../footer.php');
		?>

		<!-- JS -->
		<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.4/SmoothScroll.min.js" defer></script>
		<script src="/js/parallax.min.js" defer></script>

		<!-- LazyLoad -->
		<script src="/js/lazysizes.min.js" async></script>

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