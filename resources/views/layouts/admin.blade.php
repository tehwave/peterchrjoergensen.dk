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
        <link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}">
        @stack('styles')

        @stack('head')
    </head>
    <body class="h-100">
        <!-- Application -->
        <div class="container-fluid" id="app">
            <div class="row">
                <!-- Navigation -->
                <aside class="col-sm-3 col-lg-2 col-xl-2 py-4">
                    <article class="card card-pcj mb-4">
                        <header class="card-header text-center bg-pcj">
                           <h2 class="card-title">
                                Administration
                            </h2>
                        </header>
                        <ul class="list-group list-group-flush">
                            <a href="{{ route('admin.index') }}"><li class="list-group-item">Overview</li></a>
                            <a href="{{ route('post.create') }}"><li class="list-group-item">New Post</li></a>
                        </ul>
                        <footer class="card-footer">
                            <!-- Log out -->
                            <form action="{{ route('logout') }}" method="POST" class="text-right">
                                {{ csrf_field() }}

                                <button type="submit" role="button" class="btn btn-pcj">
                                    Log out
                                </button>
                            </form>
                        </footer>
                    </article>
                </aside>

                <!-- Main -->
                <main class="col-sm-9 col-lg-10 col-xl-8 mr-xl-auto py-4" id="admin">
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
