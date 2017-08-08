<?php
    /**
     * peterchrjoergensen.dk
     *
     * @author   Peter C. Jørgensen <hello@peterchrjoergensen.dk>
     */
?>
<main class="u-full-width portfolio">
    <!-- Introduction -->
    <section
        class="parallax intro"
        data-parallax="scroll"
        data-speed="0.6"
        data-image-src="/resources/img/portfolio.jpg"
        data-natural-width="1920"
        data-natural-height="1080"
        data-z-index="0"
    >
        <div class="container">
            <h2>Portfolio</h2>
            <p>Throughout the years, I have accumulated various <b>ambitious</b> <b>and creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
            <p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
        </div>
    </section>

    <!-- Projects -->
    <section class="projects text-center">
        <ul class="controls">
            <li><button type="button" class="button" data-filter="all">All</button></li>
            <li><button type="button" class="button" data-filter=".game">Game</button></li>
            <li><button type="button" class="button" data-filter=".video">Video</button></li>
            <li><button type="button" class="button" data-filter=".website">Website</button></li>
            <li><button type="button" class="button" data-filter=".application">Application</button></li>
            <li><button type="button" class="button" data-filter=".solo">Solo</button></li>
            <li><button type="button" class="button" data-filter=".team">Team</button></li>
            <li><button type="button" class="button" data-filter=".company">Company</button></li>
        </ul>
        <div class="container" id="mixitup">
            <hr>
            <?php foreach ($projects as $project): ?>
                <article class="project <?php echo implode(" ", $project['filters']) ?>">
                    <section class="image-wrapper">
                        <noscript>
                            <img
                                class="u-max-full-width image"
                                src="/resources/img/portfolio/<?php echo $project['image'] .".". $project['image_format'] ?>"
                                width="300" height="300" alt="<?php echo $project['title'] ?>"
                            />
                        </noscript>
                        <img
                            class="u-max-full-width image lazyload lqip"
                            src="/resources/img/portfolio/<?php echo $project['image'] ?>-lowquality.<?php echo $project['image_format'] ?>"
                            data-src="/resources/img/portfolio/<?php echo $project['image'] .".". $project['image_format'] ?>"
                            width="300" height="300" alt="<?php echo $project['title'] ?>"
                        />
                    </section>
                    <section class="description-wrapper">
                        <h2 class="title">
                            <?php echo $project['title'] ?>
                        </h2>
                        <hr>
                        <ul class="tags">
                            <?php
                                foreach ($project['tags'] as $tag) {
                                    echo "<li>". $tag ."</li>\r\n";
                                }
                            ?>
                        </ul>
                        <p class="lead">
                            <?php echo $project['lead'] ?>
                        </p>
                        <p>
                            <?php echo $project['paragraph'] ?>
                        </p>
                        <a class="button button-primary" href="<?php echo $project['button_url'] ?>" target="_blank" rel="noopener">
                            <?php echo $project['button_text'] ?>
                        </a>
                    </section>
                </article>
            <?php endforeach; ?>
        </div>
    </section>
</main>
