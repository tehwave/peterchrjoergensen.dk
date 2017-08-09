<?php
/**
 * peterchrjoergensen.dk.
 *
 * @author   Peter C. Jørgensen <hello@peterchrjoergensen.dk>
 */
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?php echo $title ?></title>

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

        <!-- Website -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#0fa0ce">
        <link rel="mask-icon" href="/resources/img/safari-pinned-tab.svg" color="#5bbad5">
        <link rel="apple-touch-icon" sizes="144x144" href="/resources/img/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/resources/img/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/resources/img/favicon-16x16.png" sizes="16x16">

        <!-- SEO -->
        <meta name="robots" content="index, follow">
        <meta name="title" content="<?php echo $title ?>">
        <meta name="author" content="Peter C. Jørgensen">
        <meta name="description" content="<?php echo $description ?>">

        <!-- Open Graph -->
        <meta property="og:type" content="profile">
        <meta property="profile:first_name" content="Peter">
        <meta property="profile:last_name" content="Jørgensen">
        <meta property="og:url" content="https://peterchrjoergensen.dk"> <!-- TODO: Get current URL instead -->
        <meta property="og:title" content="<?php echo $title ?>">
        <meta property="og:description" content="<?php echo $description ?>">
        <meta property="og:image" content="https://peterchrjoergensen.dk/resources/img/peter.jpg"> <!-- TODO: Get a better photo -->

        <!-- Twitter -->
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@tehwave">
        <meta name="twitter:title" content="<?php echo $title ?>">
        <meta name="twitter:description" content="<?php echo $description ?>">

        <!-- JSON-LD Person -->
        <script type="application/ld+json">
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
        <link rel="stylesheet" type="text/css" href="/resources/css/normalize.min.css">
        <link rel="stylesheet" type="text/css" href="/resources/css/skeleton.min.css">
        <link rel="stylesheet" type="text/css" href="/resources/css/pcj.min.css">
        <?php if (isset($stylesheets)) : ?>
            <?php foreach ($stylesheets as $stylesheet) : ?>
                <link rel="stylesheet" type="text/css" href="<?php echo $stylesheet ?>">
            <?php endforeach; ?>
        <?php endif;  ?>

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
    <body class="u-full-width">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TKNTXKZ"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        <!-- Header -->
        <header class="container header">
            <!-- Title -->
            <h1 class="title">
                <a href="/">Peter Christian Jørgensen</a>
            </h1>
            <hr>
            <!-- Navigation -->
            <nav>
                <section class="three columns"><a href="/cv" title="Peter's Curriculum Vitae">C.V.</a></section>
                <section class="three columns"><a href="/portfolio" title="Peter's Portfolio">Portfolio</a></section>
                <section class="three columns"><a href="/blog/" title="Peter's Blog">Blog</a></section>
                <!-- Social -->
                <section class="three columns">
                    <a href="mailto:hello@peterchrjoergensen.dk?subject=Hello" target="_top" class="icon" title="Send Peter an email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path data-color="color-2" d="M15 1H1c-.6 0-1 .4-1 1v1.4l8 4.5 8-4.4V2c0-.6-.4-1-1-1z"/><path d="M7.5 9.9L0 5.7V14c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V5.7L8.5 9.9c-.28.14-.72.14-1 0z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" class="icon" title="Find Peter on LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M15.3 0H.7C.3 0 0 .3 0 .7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V.7c-.1-.4-.4-.7-.8-.7zM4.7 13.6H2.4V6h2.4v7.6zM3.6 5c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8H6.2V6h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2z"/></svg>
                    </a>
                    <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" class="icon" title="Find Peter on Twitter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"/></svg>
                    </a>
                    <a href="https://www.github.com/tehwave" target="_top" class="icon" title="Find Peter on GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 .2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V14c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"/></svg>
                    </a>
                </section>
            </nav>
        </header>

        <!-- Main -->
        <?php echo isset($content) ? $content : '' ?>

        <!-- Footer -->
        <footer class="footer">
            <!-- Contact -->
            <section class="parallax contact" data-parallax="scroll" data-speed="0.6" data-image-src="/resources/img/footer.jpg" data-natural-width="1920" data-natural-height="725" data-z-index="0">
                <div class="container">
                    <section class="one-half column">
                        <h2>Get in touch</h2>
                    </section>
                    <section class="one-half column">
                        <a href="mailto:hello@peterchrjoergensen.dk?subject=Hello" target="_top" title="Send Peter an email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="#fff"><path data-color="color-2" d="M45 5H3c-1.1 0-2 .9-2 2v6c0 .37.2.7.52.88l22 12c.15.08.32.12.48.12s.33-.04.48-.12l22-12c.32-.18.52-.5.52-.88V7c0-1.1-.9-2-2-2z"/><path d="M25.44 27.63c-.45.24-.94.37-1.44.37s-1-.13-1.43-.36L1.02 15.88 1 15.9V41c0 1.1.9 2 2 2h42c1.1 0 2-.9 2-2V15.9l-.02-.02-21.54 11.75z"/></g></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" title="Find Peter on LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zM17.4 36h-5V20h5v16zm-2.5-18.2c-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9 1.6 0 2.9 1.3 2.9 2.9 0 1.6-1.3 2.9-2.9 2.9zM36 36h-5v-7.8c0-1.9 0-4.2-2.6-4.2s-3 2-3 4.1V36h-5V20h4.8v2.2h.1c.7-1.3 2.3-2.6 4.7-2.6 5 0 6 3.3 6 7.6V36z"/></svg>
                        </a>
                        <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zm-8.5 19.1v.6c0 6.5-5 14-14 14-2.8 0-5.4-.8-7.5-2.2.4 0 .8.1 1.2.1 2.3 0 4.4-.8 6.1-2.1-2.2 0-4-1.5-4.6-3.4.3.1.6.1.9.1.4 0 .9-.1 1.3-.2-2.3-.5-3.9-2.4-3.9-4.8v-.1c.7.4 1.4.6 2.2.6-1.3-.9-2.2-2.4-2.2-4.1 0-.9.2-1.7.7-2.5 2.4 3 6.1 4.9 10.1 5.1-.1-.4-.1-.7-.1-1.1 0-2.7 2.2-4.9 4.9-4.9 1.4 0 2.7.6 3.6 1.6 1.1-.2 2.2-.6 3.1-1.2-.4 1.1-1.1 2.1-2.2 2.7 1-.1 1.9-.4 2.8-.8-.6 1-1.4 1.9-2.4 2.6z"/></svg>
                        </a>
                    </section>
                </div>
            </section>
            <!-- Copyright -->
            <div class="container copyright">
                <p>
                    Twemoji by Twitter / <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener"><small>CC BY 4.0</small>.</a>
                    <span class="nucleo">Icons by <a href="https://nucleoapp.com/?ref=tehwave" target="_blank" rel="noopener"><img src="/resources/img/nucleo-logo.svg" height="16" width="66" alt="Nucleo"></a> / <a href="https://github.com/NucleoApp/license-standard/blob/master/nucleo-standard-license.txt" target="_blank" rel="noopener"><small>License</small></a></span>
                    MixItUp 3 by KunkaLabs / <a href="https://creativecommons.org/licenses/by-nd/4.0/" target="_blank" rel="noopener"><small>CC BY-ND 4.0</small></a>
                </p>
            </div>
        </footer>

        <!-- JS -->
        <script src="/resources/js/jquery-1.12.4.min.js"></script>
        <script src="/resources/js/smoothscroll.min.js" defer></script>
        <script src="/resources/js/parallax.min.js" defer></script>
        <?php if (isset($scripts)) : ?>
            <?php foreach ($scripts as $script) : ?>
                <script type="text/javascript" src="<?php echo $script ?>"></script>
            <?php endforeach; ?>
        <?php endif;  ?>
    </body>
</html>
