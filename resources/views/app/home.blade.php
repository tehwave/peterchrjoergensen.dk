@extends('layouts.app')

@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">
        <div class="container text-white">
            <div class="row my-4 my-xl-6">
                <div class="col">
                    <div class="h1">Hello</div>
                    <p class="h3 my-xl-4">My name is <b>Peter.</b> It's nice to meet you.</p>
                    <p class="h3 my-xl-4">I am a <b>Web Developer</b> from <b>Denmark</b> with a speciality in <b>PHP</b>.
                </div>
            </div>
        </div>
    </div>

    <!-- Projects -->
    <div class="container mt-n4 mt-xl-n6">
        <div class="row">
            <div class="col">
                <div class="card-deck mb-4">
                    <div class="card shadow-md overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/firkant-lowquality.png') }}"
                            data-src="{{ asset('img/firkant.png') }}"
                            alt="FIRKANT"
                        />
                        <section class="card-body">
                            <h2 class="card-title">FIRKANT</h2>
                            <p class="card-text">A fast-paced, procedural platforming video game</p>
                        </section>
                        <footer class="card-footer bg-white border-top-0">
                            <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </div>
                    <div class="card shadow-md overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/grundfos-lowquality.png') }}"
                            data-src="{{ asset('img/grundfos.png') }}"
                            alt="Grundfos"
                        />
                        <section class="card-body">
                            <h2 class="card-title">Grundfos Safety</h2>
                            <p class="card-text">A safety instructions and quiz web application for visitors to the Grundfos facilities</p>
                        </section>
                        <footer class="card-footer bg-white border-top-0">
                            <a href="https://tehwave.github.io/grundfos-quiz/" target="_blank" rel="noopener" class="card-link">Example</a>
                            <a href="https://github.com/tehwave/grundfos-quiz/" target="_blank" rel="noopener" class="card-link">GitHub</a>
                        </footer>
                    </div>
                    <div class="card shadow-md overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/gm48-lowquality.png') }}"
                            data-src="{{ asset('img/gm48.png') }}"
                            alt="GM48"
                        />
                        <section class="card-body">
                            <h2 class="card-title">GM48</h2>
                            <p class="card-text">A games development competition</p>
                        </section>
                        <footer class="card-footer bg-white">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </div>
                </div>
            </div>
        </div>

        {{-- Blog --}}
        <div class="row mt-4 mt-xl-6 px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Latest posts from my blog</h2>
            </div>
            <div class="col-4 text-right">
                <a class="text-muted card-link" href="{{ route('blog') }}">See all</a>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card-deck mb-4">
                    @foreach ($posts as $post)

                        @if ($loop->iteration === 2)
                            <div class="card bg-light shadow-md">
                                <div class="card-header bg-secondary">
                                    <h3 class="card-title h4 my-2 text-white">
                                        Don't miss out
                                    </h3>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">
                                        In my blog, I write about the ideas, the insights and the techniques behind my projects.
                                        In addition, I share news, events and resources relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave">#webdev</a> and <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave">#gamedev</a>.
                                    </p>
                                    <p class="card-text">
                                        If that sounds interesting to you, don't miss out on great content by following me on <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" title="Find Peter on LinkedIn">LinkedIn</a>, <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">Twitter</a> and <a href="https://www.github.com/tehwave" target="_blank" rel="noopener" title="Find Peter on GitHub">GitHub</a>.
                                    </p>
                                </div>
                            </div>
                </div>
                <div class="card-deck mb-4 mb-xl-6">
                            @continue
                        @endif

                        <div class="card shadow-md">
                            <div class="card-header bg-transparent">
                                <h3 class="card-title h4 my-2">
                                    <a href="{{ $post->url }}">
                                        {{ $post->title }}
                                    </a>
                                </h3>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    {!! $post->excerpt !!}
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endsection