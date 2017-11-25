@extends('layouts.app')

@section('app')

    <!-- Header -->
    <header class="container text-center my-4">
        <!-- Title -->
        <div class="row">
            <section class="col">
                <h1>
                    <a href="/">Peter Christian Jørgensen</a>
                    <hr>
                </h1>
            </section>
        </div>

        <!-- Navigation -->
        <nav class="row">

            <!-- Links -->
            <section class="col-12 col-sm-6 col-md">
                <a href="/cv" title="Peter's Curriculum Vitae">C.V.</a>
            </section>
            <section class="col-12 col-sm-6 col-md">
                <a href="/portfolio" title="Peter's Portfolio">Portfolio</a>
            </section>
            <section class="col-12 col-sm-6 col-md">
                <a href="//blog.peterchrjoergensen.dk" title="Peter's Blog">Blog</a>
            </section>

            <!-- Social -->
            <section class="col-12 col-sm-6 col-md">
                <a href="mailto:hello@peterchrjoergensen.dk?subject=Hello" target="_top" title="Send Peter an email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path data-color="color-2" d="M15 1H1c-.6 0-1 .4-1 1v1.4l8 4.5 8-4.4V2c0-.6-.4-1-1-1z"/><path d="M7.5 9.9L0 5.7V14c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V5.7L8.5 9.9c-.28.14-.72.14-1 0z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" title="Find Peter on LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M15.3 0H.7C.3 0 0 .3 0 .7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V.7c-.1-.4-.4-.7-.8-.7zM4.7 13.6H2.4V6h2.4v7.6zM3.6 5c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8H6.2V6h2.3v1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2z"/></svg>
                </a>
                <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"/></svg>
                </a>
                <a href="https://www.github.com/tehwave" target="_blank" rel="noopener" title="Find Peter on GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 .2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V14c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"/></svg>
                </a>
            </section>
        </nav>
    </header>

    <!-- Introduction -->
    <header
        class="mb-4"
        data-image-src="{{ asset('img/home.jpg') }}"
        data-natural-height="1080"
        data-natural-width="1920"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row py-5 text-white">
                <section class="col">
                    <h2 class="h1">Hello,</h2>
                    <p>My name is <b>Peter.</b> It's nice to meet you.</p>
                    <p>I am a <b>Multimedia Designer</b> in <b>Denmark</b> with a specialty in <b>Film & Animation</b>, and I love to work with <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener" class="twitter-search">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener" class="twitter-search">#gamedev</a>.</p>
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
                            <img class="card-img-top" src="{{ asset('img/gm48.png') }}" alt="GM48"/>
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
            </section>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <section class="col mt-3 text-center">
                <a href="/portfolio" class="btn btn-outline-link btn-lg">Browse my portfolio</a>
            </section>
        </div>
        <div class="row mt-5">
            <section class="col">
                <h3>Latest posts from my blog</h3>
                <hr>
            </section>
        </div>
        <div class="row" id="wp-posts">
            <section class="col-12  mb-3 text-center" id="wp-posts-loading">
                <img src="/resources/img/loading.svg">
            </section>
        </div>
        <div class="row">
            <section class="col text-center">
                <a href="/blog" class="btn btn-outline-link btn-lg">Visit my blog</a>
            </section>
        </div>
    </div>

    <!-- Footer -->
    <footer>

        <!-- Contact -->
        <section
            data-image-src="{{ asset('img/footer.jpg') }}"
            data-natural-width="1920"
            data-natural-height="725"
            data-parallax="scroll"
            data-speed="0.6"
            data-z-index="0"
        >
            <div class="container">
                <div class="row py-5 text-white text-center">
                    <section class="col-12 mb-4 col-lg mb-lg-0">
                        <h2 class="h1">Get in touch</h2>
                    </section>
                    <section class="col-12 col-lg">
                        <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" class="pr-3" rel="noopener" title="Find Peter on LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zM17.4 36h-5V20h5v16zm-2.5-18.2c-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9 1.6 0 2.9 1.3 2.9 2.9 0 1.6-1.3 2.9-2.9 2.9zM36 36h-5v-7.8c0-1.9 0-4.2-2.6-4.2s-3 2-3 4.1V36h-5V20h4.8v2.2h.1c.7-1.3 2.3-2.6 4.7-2.6 5 0 6 3.3 6 7.6V36z"/></svg>
                        </a>
                        <a href="mailto:hello@peterchrjoergensen.dk?subject=Hello" target="_top" class="pr-3" title="Send Peter an email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="#fff"><path data-color="color-2" d="M45 5H3c-1.1 0-2 .9-2 2v6c0 .37.2.7.52.88l22 12c.15.08.32.12.48.12s.33-.04.48-.12l22-12c.32-.18.52-.5.52-.88V7c0-1.1-.9-2-2-2z"/><path d="M25.44 27.63c-.45.24-.94.37-1.44.37s-1-.13-1.43-.36L1.02 15.88 1 15.9V41c0 1.1.9 2 2 2h42c1.1 0 2-.9 2-2V15.9l-.02-.02-21.54 11.75z"/></g></svg>
                        </a>
                        <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zm-8.5 19.1v.6c0 6.5-5 14-14 14-2.8 0-5.4-.8-7.5-2.2.4 0 .8.1 1.2.1 2.3 0 4.4-.8 6.1-2.1-2.2 0-4-1.5-4.6-3.4.3.1.6.1.9.1.4 0 .9-.1 1.3-.2-2.3-.5-3.9-2.4-3.9-4.8v-.1c.7.4 1.4.6 2.2.6-1.3-.9-2.2-2.4-2.2-4.1 0-.9.2-1.7.7-2.5 2.4 3 6.1 4.9 10.1 5.1-.1-.4-.1-.7-.1-1.1 0-2.7 2.2-4.9 4.9-4.9 1.4 0 2.7.6 3.6 1.6 1.1-.2 2.2-.6 3.1-1.2-.4 1.1-1.1 2.1-2.2 2.7 1-.1 1.9-.4 2.8-.8-.6 1-1.4 1.9-2.4 2.6z"/></svg>
                        </a>
                    </section>
                </div>
            </div>
        </section>

        <!-- Copyright -->
        <div class="container text-center">
            <div class="row py-4">
                <section class="col">
                    Designed and developed by Peter <span title="tehwave">🌊</span> Jørgensen
                    <a href="https://github.com/tehwave/peterchrjoergensen.dk" target="_blank" rel="noopener" title="Find the source code on GitHub" class="ml-2 align-middle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 .2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V14c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"/></svg>
                    </a>
                </section>
            </div>
        </div>
    </footer>
@endsection