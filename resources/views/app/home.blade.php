@extends('layouts.app')

@section('app')
    <!-- Introduction -->
    <header
        class="pcj-parallax pcj-header pcj-home-header"
        data-image-src="{{ asset('img/home.jpg') }}"
        data-natural-height="1080"
        data-natural-width="1920"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Hello,</h2>
                    <p>My name is <b>Peter.</b> It's nice to meet you.</p>
                    <p>I am a <b>Multimedia Designer</b> in <b>Denmark</b> with a specialty in <b>Film & Animation</b>, and I love to work with <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a>.</p>
                </section>
            </div>
       </div>
    </header>

    <!-- Projects -->
    <div class="container">
        <div class="row">
            <section class="col">
                <h3>I'm proud of these exceptional projects</h3>
                <hr>
            </section>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <section class="col-12 mx-auto col-lg-12 col-xl-10">
                <div class="card-deck">
                    <article class="card mb-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/firkant.png') }}"
                                alt="FIRKANT"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset('img/firkant-lowquality.png') }}"
                            data-src="{{ asset('img/firkant.png') }}"
                            alt="FIRKANT"
                        />
                        <section class="card-body">
                            <h2 class="card-title">FIRKANT</h2>
                            <p class="card-text">A fast-paced, procedural platforming video game</p>
                        </section>
                        <footer class="card-footer">
                            <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card mb-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/b2bkolding.png') }}"
                                alt="B2B Kolding"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset('img/b2bkolding-lowquality.png') }}"
                            data-src="{{ asset('img/b2bkolding.png') }}"
                            alt="B2B Kolding"
                        />
                        <section class="card-body">
                            <h2 class="card-title">B2B Kolding</h2>
                            <p class="card-text">A custom Wordpress website for a local trade fair</p>
                        </section>
                        <footer class="card-footer">
                            <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card mb-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/gm48.png') }}"
                                alt="GM48"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset('img/gm48-lowquality.png') }}"
                            data-src="{{ asset('img/gm48.png') }}"
                            alt="GM48"
                        />
                        <section class="card-body">
                            <h2 class="card-title">GM48</h2>
                            <p class="card-text">A games development competition</p>
                        </section>
                        <footer class="card-footer">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                            <a href="https://blog.peterchrjoergensen.dk/category/gm48/" target="_blank" rel="noopener" class="card-link">Blog</a>
                        </footer>
                    </article>
                </div>
            </section>
        </div>
    </div>
    <div class="container">
        <div class="row mb-5">
            <section class="col mt-3 text-center">
                <a href="{{ route('portfolio') }}" class="btn btn-outline-pcj">Browse my portfolio</a>
            </section>
        </div>
    </div>

    {{-- Blog --}}

    <div class="container">
        <div class="row mt-5">
            <section class="col">
                <h3>Latest posts from my blog</h3>
                <hr>
            </section>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <section class="col-12 mx-auto col-lg-12 col-xl-10">
                <div class="card-deck">
                    @foreach (App\Post::published()->orderBy('published_at')->get()->take(4) as $post)
                        <article class="card mb-4">
                            <section class="card-body">
                                <h1 class="card-title h2">
                                    <a href="{{ route('post.show', $post->slug) }}" class="card-link">{{ $post->title }}</a>
                                </h1>
                                <h2 class="card-subtitle mb-2 text-muted h6">
                                    {{ $post->published_at->format('F jS, Y') }}
                                </h2>
                                @foreach ($post->tags as $tag)
                                    <span class="badge badge-pill badge-pcj">{{ $tag->name }}</span>
                                @endforeach
                                <p class="card-text">
                                    {!! $post->excerpt() !!}
                                </p>
                            </section>
                        </article>
                    @endforeach
                </div>
            </section>
        </div>
        <div class="row mb-5">
            <section class="col text-center">
                <a href="{{ route('post.index') }}" class="btn btn-outline-pcj">Read my blog</a>
            </section>
        </div>
    </div>

@endsection