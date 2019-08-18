<div class="container">
    <nav class="navbar navbar-dark navbar-expand-lg">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16" class="align-bottom"><g class="nc-icon-wrapper" fill="#ffffff"><rect fill="#ffffff" width="16" height="3"></rect> <rect data-color="color-2" y="6" fill="#ffffff" width="16" height="3"></rect> <rect y="12" fill="#ffffff" width="16" height="3"></rect></g></svg>
            Browse
        </button>
        <a class="navbar-brand" href="{{ route('home') }}">
            <h1 class="badge badge-primary px-4 py-2 mb-0 rounded-pill">
                <span class="d-block d-sm-none">{{ "\u{1F30A}" }}</span>
                <span class="d-none d-sm-block">Peter C. Jørgensen</span>
            </h1>
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
