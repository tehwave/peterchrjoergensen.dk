@extends('layouts.app')

@section('header')
    <div class="container">
        <div class="row">
            <section class="col">
                <article class="pcj-header-content">
                    <h2 class="h1">Hello,</h2>
                    <p>My name is <b>Peter.</b> It's nice to meet you. 🙂</p>
                    <p>I am a <b>Multimedia Designer</b> in <b>Denmark</b> with a specialty in <b>Film & Animation</b>, and I love to work with <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a>.</p>
                </article>
            </section>
        </div>
    </div>
@endsection

@section('app')

    <!-- Projects -->
    <div class="container" style="margin-top: -3rem;">
        <div class="row">
            <section class="col">
                <div class="card-deck mb-4">
                    <article class="card">
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
                        <footer class="card-footer bg-white border-top-0">
                            <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card">
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
                        <footer class="card-footer bg-white border-top-0">
                            <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card">
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
                        <footer class="card-footer bg-white border-top-0">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                </div>
            </section>
        </div>

        {{-- Blog --}}
        <div class="row my-2">
            <section class="col-8 text-muted">
                Latest posts from my blog
            </section>
            <section class="col-4 text-right">
                <a href="{{ route('post.index') }}">See all</a>
            </section>
        </div>
        <div class="row">
            <section class="col-12">
                <div class="card-deck mb-sm-4">
                    @include('components.post', ['post' => $posts[0]])
                    <article class="card text-white">
                        <img class="card-img" src="{{ asset('img/home.jpg') }}">
                        <div class="card-img-overlay">
                            <h1 class="card-title h2">
                                Don't miss out
                            </h1>
                            <p class="card-text">
                                In my blog, I write about the ideas, the insights and the techniques behind my projects.
                                In addition, I share news, events and resources relevant to the <a class="card-link" href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave">#webdev</a> and <a class="card-link" href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave">#gamedev</a>.
                            </p>
                            <p class="card-text">
                                If that sounds interesting to you, don't miss out on great content by following me on <a class="card-link" href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" title="Find Peter on LinkedIn">LinkedIn</a>, <a class="card-link" href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">Twitter</a> and <a class="card-link" href="https://www.github.com/tehwave" target="_blank" rel="noopener" title="Find Peter on GitHub">GitHub</a>.
                            </p>
                            <a class="card-link" href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" title="Find Peter on LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" width="24" height="24"><g class="nc-icon-wrapper" fill="#ffffff"><path fill="#ffffff" d="M23,0H1C0.4,0,0,0.4,0,1v22c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1V1C24,0.4,23.6,0,23,0z M7.1,20.5H3.6V9h3.6 V20.5z M5.3,7.4c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1c1.1,0,2.1,0.9,2.1,2.1C7.4,6.5,6.5,7.4,5.3,7.4z M20.5,20.5h-3.6 v-5.6c0-1.3,0-3-1.8-3c-1.9,0-2.1,1.4-2.1,2.9v5.7H9.4V9h3.4v1.6h0c0.5-0.9,1.6-1.8,3.4-1.8c3.6,0,4.3,2.4,4.3,5.5V20.5z"></path></g></svg>
                            </a>
                            <a class="card-link" href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" width="24" height="24"><g class="nc-icon-wrapper" fill="#ffffff"><path fill="#ffffff" d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"></path></g></svg>
                            </a>
                            <a class="card-link" href="https://www.github.com/tehwave" target="_blank" rel="noopener" title="Find Peter on GitHub">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" width="24" height="24"><g class="nc-icon-wrapper" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" fill="#ffffff" d="M12,0.3c-6.6,0-12,5.4-12,12c0,5.3,3.4,9.8,8.2,11.4 C8.8,23.8,9,23.4,9,23.1c0-0.3,0-1,0-2c-3.3,0.7-4-1.6-4-1.6c-0.5-1.4-1.3-1.8-1.3-1.8C2.5,17,3.7,17,3.7,17 c1.2,0.1,1.8,1.2,1.8,1.2c1.1,1.8,2.8,1.3,3.5,1c0.1-0.8,0.4-1.3,0.8-1.6c-2.7-0.3-5.5-1.3-5.5-5.9c0-1.3,0.5-2.4,1.2-3.2 C5.5,8.1,5,6.9,5.7,5.3c0,0,1-0.3,3.3,1.2c1-0.3,2-0.4,3-0.4c1,0,2,0.1,3,0.4c2.3-1.6,3.3-1.2,3.3-1.2c0.7,1.7,0.2,2.9,0.1,3.2 c0.8,0.8,1.2,1.9,1.2,3.2c0,4.6-2.8,5.6-5.5,5.9c0.4,0.4,0.8,1.1,0.8,2.2c0,1.6,0,2.9,0,3.3c0,0.3,0.2,0.7,0.8,0.6 c4.8-1.6,8.2-6.1,8.2-11.4C24,5.7,18.6,0.3,12,0.3z"></path></g></svg>
                            </a>
                        </div>
                    </article>
                </div>
                <div class="card-deck mb-4">
                    @include('components.post', ['post' => $posts[1]])
                    @include('components.post', ['post' => $posts[2]])
                </div>
            </section>
        </div>
    </div>
@endsection
