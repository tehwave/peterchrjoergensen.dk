<div class="container">
    <nav class="navbar navbar-expand-lg">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16" class="align-bottom"><g class="nc-icon-wrapper" fill="#ffffff"><rect fill="#ffffff" width="16" height="3"></rect> <rect data-color="color-2" y="6" fill="#ffffff" width="16" height="3"></rect> <rect y="12" fill="#ffffff" width="16" height="3"></rect></g></svg>
            Browse
        </button>
        <a class="navbar-brand" href="{{ route('home') }}">
            <h1 class="badge badge-primary">
                <span class="d-block d-sm-none">🌊</span>
                <span class="d-none d-sm-block">Peter C. Jørgensen</span>
            </h1>
        </a>
        <div class="collapse navbar-collapse" id="navbar">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('curriculum-vitae') }}" title="Peter's Curriculum Vitae">C.V.</a>
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
