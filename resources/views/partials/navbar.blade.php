<div class="bg-secondary pattern-waves" id="navbar-bg">
    <div class="container">
        <nav class="navbar navbar-dark navbar-expand-lg">
            <button class="navbar-toggler text-white" type="button" data-toggle="collapse" data-target="#navbar">
                Browse
            </button>
            <a class="navbar-brand" href="{{ route('home') }}">
                <div class="badge badge-primary h1 rounded-pill px-4 py-2 mb-0">
                    <span class="d-block d-sm-none">{{ "\u{1F30A}" }}</span>
                    <span class="d-none d-sm-block">Peter C. Jørgensen</span>
                </div>
            </a>
            <div class="collapse navbar-collapse" id="navbar">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('resume') }}" title="Peter's Resume">Résumé</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('portfolio') }}" title="Peter's Portfolio">Portfolio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('blog') }}" title="Peter's Blog">Blog</a>
                    </li>
                </ul>

            </div>
        </nav>
    </div>
</div>
