<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

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
        <title>@yield('title', 'Peter C. Jørgensen')</title>

        <!-- Website -->
        <link rel="manifest" href="{{ asset('manifest.json') }}">
        <meta name="theme-color" content="#0fa0ce">
        <link rel="mask-icon" href="#TODO" color="#5bbad5">
        <link rel="apple-touch-icon" sizes="144x144" href="#TODO">
        <link rel="icon" type="image/png" href="#TODO" sizes="32x32">
        <link rel="icon" type="image/png" href="#TODO" sizes="16x16">

        <!-- SEO -->
        @section('head')
            <meta name="title" content="@yield('title', 'Peter C. Jørgensen')">
            <meta name="author" content="@yield('description', 'TODO')">
            <meta name="description" content="#TODO">
        @show

        <!-- Open Graph -->
        @section('open-graph')
            <meta property="og:type" content="profile">
            <meta property="profile:first_name" content="Peter">
            <meta property="profile:last_name" content="Jørgensen">
            <meta property="og:url" content="{{ url()->full() }}">
            <meta property="og:title" content="@yield('title', 'Peter C. Jørgensen')">
            <meta property="og:description" content="@yield('description', 'TODO')"">
            <meta property="og:image" content="#TODO">
        @show

        <!-- Twitter -->
        @section('twitter')
            <meta name="twitter:card" content="summary">
            <meta name="twitter:site" content="@tehwave">
            <meta name="twitter:title" content="@yield('title', 'Peter C. Jørgensen')">
            <meta name="twitter:description" content="@yield('description', 'TODO')"">
            <meta name="twitter:image" content="#TODO">
        @show

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

        <!-- Google Tag Manager -->
        <script>
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TKNTXKZ');
        </script>

        <!-- Fonts -->

        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}">
        @stack('styles')

        @stack('head')
    </head>
    <body class="h-100">
        <!-- Google Tag Manager (noscript) -->
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TKNTXKZ" height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript>

        <!-- No JavaScript Alert -->
        <noscript>
            <div class="alert alert-danger mb-0 rounded-0" role="alert">
                <p class="mb-0">You are browsing <strong>without</strong> JavaScript. Please enable it for your web browser to improve your experience.</p>
            </div>
        </noscript>

        <!-- Application -->
        @yield('app')

        <!-- Scripts -->
        <script src="{{ mix('js/manifest.js') }}"></script>
        <script src="{{ mix('js/vendor.js') }}"></script>
        <script src="{{ mix('js/app.js') }}"></script>
        @stack('scripts')
    </body>
</html>
