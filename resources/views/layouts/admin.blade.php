<!doctype html>
<html lang="{{ app()->getLocale() }}" class="h-100">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
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

        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="{{ mix('css/bootstrap.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}" media="none" onload="if (media!=='all') media='all'">
        <noscript>
            <link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}">
        </noscript>
        @stack('styles')

        @stack('head')
    </head>
    <body class="h-100">

        <!-- Application -->
        <div class="container-fluid h-100" id="app">
            <div class="row">
                <!-- Navigation -->
                <section class="my-auto col-lg-8 mx-lg-auto py-4">
                    <nav class="navbar navbar-expand-sm navbar-light bg-white border rounded">
                        <a class="navbar-brand" href="{{ route('admin.index') }}">🌊</a>
                        @auth
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#adminNavbar">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <div class="collapse navbar-collapse" id="adminNavbar">

                                <ul class="navbar-nav mr-auto">
                                    <li class="nav-item">
                                        <a class="nav-link" href="{{ route('post.create') }}">New Post</a>
                                    </li>
                                </ul>
                                <!-- Log out -->
                                <form class="form-inline my-2 my-lg-0" action="{{ route('logout') }}" method="POST">
                                    {{ csrf_field() }}

                                    <button type="submit" role="button" class="btn btn-outline-pcj my-2 my-sm-0">
                                        Log out
                                    </button>
                                </form>
                            </div>
                        @endauth
                    </nav>
                </section>
            </div>
            <div class="row">
                <!-- Main -->
                <main class="my-auto col-lg-8 mx-lg-auto py-4" id="admin">
                    @yield('admin')
                </main>
            </div>
        </div>

        <!-- Scripts -->
        <script src="{{ mix('js/manifest.js') }}"></script>
        <script src="{{ mix('js/vendor.js') }}"></script>
        <script src="{{ mix('js/app.js') }}"></script>
        @stack('scripts')
    </body>
</html>
