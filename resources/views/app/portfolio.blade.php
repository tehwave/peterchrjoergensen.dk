@extends('layouts.app')

@section('app')
    <!-- Introduction -->
    <header
        class="pcj-parallax pcj-header pcj-portfolio-header"
        data-image-src="{{ asset('img/portfolio.jpg') }}"
        data-natural-height="1282"
        data-natural-width="1920"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Portfolio</h2>
                    <p>Throughout the years, I have accumulated various <b>ambitious</b> and <b>creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
                    <p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
                </section>
            </div>
       </div>
    </header>

    <!-- Controls -->
    <div class="container mt-5">
        <div class="row">
            <section class="col">
                <div class="d-md-flex justify-content-md-center">
                    <div class="btn-group mb-2 mb-sm-0 mr-sm-4" role="group" aria-label="Show All">
                        <button type="button" class="btn btn-outline-pcj" data-filter="all">All</button>
                    </div>
                    <div class="btn-group mb-2 mb-sm-0 mr-sm-4" role="group" aria-label="Filters for Type">
                        <button type="button" class="btn btn-outline-pcj" data-filter=".game">Game</button>
                        <button type="button" class="btn btn-outline-pcj" data-filter=".video">Video</button>
                        <button type="button" class="btn btn-outline-pcj" data-filter=".website">Website</button>
                        <button type="button" class="btn btn-outline-pcj" data-filter=".other">Other</button>
                    </div>
                    <div class="btn-group mb-2 mb-sm-0" role="group" aria-label="Additional Filters">
                        <button type="button" class="btn btn-outline-pcj" data-filter=".solo">Solo</button>
                        <button type="button" class="btn btn-outline-pcj" data-filter=".team">Team</button>
                        <button type="button" class="btn btn-outline-pcj" data-filter=".company">Company</button>
                    </div>
                </div>
                <hr>
            </section>
        </div>
    </div>

    <div class="container mb-5" id="mixitup">
        <div class="row">
            @foreach ($projects as $project)
                <section class="col-12 col-md-6 mix {{ implode(' ', $project['filters']) }}">
                    <article class="card card-pcj mb-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset(sprintf('img/%s.%s', $project['image'], $project['image_format'])) }}"
                                alt="{{ $project['title'] }}"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset(sprintf('img/%s-lowquality.%s', $project['image'], $project['image_format'])) }}"
                            data-src="{{ asset(sprintf('img/%s.%s', $project['image'], $project['image_format'])) }}"
                            alt="{{ $project['title'] }}"
                        />
                        <section class="card-body">
                            <h2 class="card-title">{{ $project['title'] }}</h2>
                            <p class="card-text lead">{{ $project['lead'] }}</p>
                            <p class="card-text">{{ $project['paragraph'] }}</p>
                        </section>
                        @isset ($project['link'])
                            <footer class="card-footer">
                                <a href="{{ $project['link'] }}" target="_blank" rel="noopener" class="card-link">{{ $project['link_text'] }}</a>
                            </footer>
                        @endisset
                    </article>
                </section>
            @endforeach
        </div>
    </div>
@endsection