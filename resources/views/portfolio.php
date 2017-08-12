<?php
/**
 * peterchrjoergensen.dk.
 *
 * @author   Peter C. Jørgensen <hello@peterchrjoergensen.dk>
 */
?>
<main class="portfolio">
    <!-- Introduction -->
    <section
        class="parallax intro"
        data-parallax="scroll"
        data-speed="0.6"
        data-image-src="<?php echo img('portfolio.jpg') ?>"
        data-natural-width="1920"
        data-natural-height="1080"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Portfolio</h2>
                    <p>Throughout the years, I have accumulated various <b>ambitious</b> <b>and creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
                    <p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
                </section>
            </div>
       </div>
    </section>

    <!-- Controls -->
    <div class="container controls">
        <div class="row">
            <section class="col">
                <div class="d-md-flex justify-content-md-center">
                    <div class="btn-group mb-2 mb-sm-0 mr-sm-4" role="group" aria-label="Show All">
                        <button type="button" class="btn btn-outline-primary" data-filter="all">All</button>
                    </div>
                    <div class="btn-group mb-2 mb-sm-0 mr-sm-4" role="group" aria-label="Filters for Type">
                        <button type="button" class="btn btn-outline-primary" data-filter=".game">Game</button>
                        <button type="button" class="btn btn-outline-primary" data-filter=".video">Video</button>
                        <button type="button" class="btn btn-outline-primary" data-filter=".website">Website</button>
                        <button type="button" class="btn btn-outline-primary" data-filter=".other">Other</button>
                    </div>
                    <div class="btn-group mb-2 mb-sm-0" role="group" aria-label="Additional Filters">
                        <button type="button" class="btn btn-outline-primary" data-filter=".solo">Solo</button>
                        <button type="button" class="btn btn-outline-primary" data-filter=".team">Team</button>
                        <button type="button" class="btn btn-outline-primary" data-filter=".company">Company</button>
                    </div>
                </div>

            </section>
        </div>
        <div class="row">
            <section class="col">
                <hr>
            </section>
        </div>
    </div>

    <!-- Projects -->
    <div class="container" id="mixitup">
        <div class="row">
            <?php foreach ($projects as $project) : ?>
                 <section class="col-12 col-md-6 project <?php echo implode(' ', $project['filters']) ?>">
                    <article class="card m-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="<?php echo img($project['image'].'.'.$project['image_format']) ?>"
                                alt="<?php echo $project['title'] ?>"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="<?php echo img($project['image'].'-lowquality.'.$project['image_format']) ?>"
                            data-src="<?php echo img($project['image'].'.'.$project['image_format']) ?>"
                            alt="<?php echo $project['title'] ?>"
                        />
                        <div class="card-body">
                            <h1 class="card-title"><?php echo $project['title'] ?></h1>
                            <p class="card-text">
                            <?php
                            foreach ($project['tags'] as $tag) {
                                echo '<span class="badge badge-light">'.$tag."</span>\r\n";
                            }
                            ?>
                            </p>
                            <p class="card-text"><?php echo $project['lead'] ?></p>
                            <p class="card-text"><?php echo $project['paragraph'] ?></p>
                            <?php if (isset($project['button_url'])) : ?>
                                <a class="btn btn-primary" href="<?php echo $project['button_url'] ?>" target="_blank" rel="noopener">
                                    <?php echo $project['button_text'] ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </article>
                </section>
            <?php endforeach; ?>
        </div>
    </div>
</main>
