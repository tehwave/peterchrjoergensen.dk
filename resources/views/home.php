<?php
/**
 * peterchrjoergensen.dk.
 *
 * @author   Peter C. Jørgensen <hello@peterchrjoergensen.dk>
 */
?>
<main class="home">
    <!-- Introduction -->
    <header
        class="parallax intro"
        data-parallax="scroll"
        data-speed="0.6"
        data-image-src="<?php echo img('home.jpg') ?>"
        data-natural-width="1920"
        data-natural-height="1080"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
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
                                src="<?php echo img('firkant.png') ?>"
                                alt="FIRKANT"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="<?php echo img('firkant-lowquality.png') ?>"
                            data-src="<?php echo img('firkant.png') ?>"
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
                                src="<?php echo img('b2bkolding.png') ?>"
                                alt="B2B Kolding"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="<?php echo img('b2bkolding-lowquality.png') ?>"
                            data-src="<?php echo img('b2bkolding.png') ?>"
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
                            <img class="card-img-top" src="<?php echo img('gm48.png') ?>" alt="GM48"/>
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="<?php echo img('gm48-lowquality.png') ?>"
                            data-src="<?php echo img('gm48.png') ?>"
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
</main>


