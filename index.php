<?php ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Peter C. Jørgensen</title>

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
		<meta name="title" content="Peter C. Jørgensen">
		<meta name="author" content="Peter C. Jørgensen">
		<meta name="description" content="The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.">

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
		<meta property="og:title" content="Peter C. Jørgensen">
		<meta property="og:url" content="https://peterchrjoergensen.dk">
		<meta property="og:image" content="https://peterchrjoergensen.dk/img/peter.jpg">
		<meta property="og:description" content="The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.">

		<!-- Twitter -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@tehwave">
		<meta name="twitter:title" content="Peter C. Jørgensen">
		<meta name="twitter:description" content="The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.">

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
	</head>
	<!-- neck -->
	<body class="home u-full-width">
		<!-- Google Tag Manager (noscript) -->
		<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TKNTXKZ"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<!-- End Google Tag Manager (noscript) -->

		<!-- Header -->
		<?php
			require_once('header.php');
		?>

		<!-- Main -->
		<main class="u-full-width">
			<!-- Introduction -->
			<section class="parallax intro" data-parallax="scroll" data-speed="0.6" data-image-src="/img/home.jpg" data-natural-width="1920" data-natural-height="1080" data-z-index="0">
				<div class="container">
					<h2>Hello,</h2>
					<p>My name is <b>Peter.</b> It's nice to meet you.</p>
					<p>I am a <b>Multimedia Designer</b> in <b>Denmark</b> with a specialty in <b>Film & Animation</b>, and I like to work with <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener" class="twitter-search">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener" class="twitter-search">#gamedev</a> as a hobby.</p>
				</div>
			</section>

			<!-- Projects -->
			<div class="container projects text-center">
				<h3>I'm exceptionally proud of these projects</h3>
				<hr>
				<div class="row">
					<div class="one-third column project">
						<h2>FIRKANT</h2>
						<p class="lead">A fast-paced, procedural platformer</p>
						<div><a class="button" href="/FIRKANT" target="_blank" rel="noopener">Check it out</a></div>
					</div>
					<div class="one-third column project">
						<h2>B2B Kolding</h2>
						<p class="lead">A Wordpress website for a local trade fair</p>
						<div><a class="button" href="https://www.b2bkolding.dk" target="_blank" rel="noopener">Take a browse</a></div>
					</div>
					<div class="one-third column project">
						<h2>GM48</h2>
						<p class="lead">A quarterly 48 hours GameMaker game jam</p>
						<div><a class="button" href="http://www.gm48.net/" target="_blank" rel="noopener">Visit the website</a></div>
					</div>
				</div>
				<div class="row">
					<div class="portfolio-referral text-center">
						You can find more of my projects on my <a href="/portfolio">portfolio.</a>
					</div>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<?php
			require_once('footer.php');
		?>

		<!-- JS -->
		<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.4/SmoothScroll.min.js" defer></script>
		<script src="/js/parallax.min.js" defer></script>
	</body>
</html>