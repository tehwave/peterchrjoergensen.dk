<?php
/**
 * peterchrjoergensen.dk.
 *
 * @author   Peter C. Jørgensen <hello@peterchrjoergensen.dk>
 */
?>
<main class="cv">
    <!-- Introduction -->
    <section class="parallax intro"
        data-parallax="scroll"
        data-speed="0.6"
        data-image-src="/resources/img/home.jpg"
        data-natural-width="1920"
        data-natural-height="1080"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Curriculum Vitae</h2>
                </section>
            </div>
            <div class="row">
                <section class="col">
                    <a href="/resources/files/CV-Peter-Christian-Jørgensen-English.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        Download &nbsp; (English <img src="/resources/img/english.png" width="20" class="align-baseline"> )
                    </a>
                    <a href="/resources/files/CV-Peter-Christian-Jørgensen-Dansk.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        Download &nbsp; (Dansk <img src="/resources/img/dansk.png" width="20" class="align-baseline"> )
                    </a>
                </section>
            </div>
        </div>
    </section>

    <!-- Education -->
    <div class="container mb-5">
        <div class="row mt-4">
            <section class="col-12">
                <h3 class="h2">Education</h3>
                <hr>
            </section>
        </div>
        <?php foreach ($educations as $education) : ?>
            <div class="row">
                <section class="col-2">
                    <?php echo $education['date'] ?>
                </section>
                <section class="col-8">
                    <h3>
                        <?php echo $education['title'] ?>
                        <small><?php echo $education['school'] ?></small>
                    </h3>
                </section>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- Experience -->
    <div class="container mb-5">
        <div class="row mt-4">
            <section class="col-12">
                <h3 class="h2">Experience</h3>
                <hr>
            </section>
        </div>
        <?php foreach ($experiences as $experience) : ?>
            <div class="row">
                <section class="col-2">
                    <?php echo $experience['date'] ?>
                </section>
                <section class="col-8">
                    <h3>
                        <?php echo $experience['title'] ?>
                        <small><?php echo $experience['company'] ?></small>
                    </h3>
                    <?php foreach ($experience['summary'] as $summary) : ?>
                        <p>
                            <?php echo $summary ?>
                        </p>
                    <?php endforeach; ?>
                </section>
            </div>
        <?php endforeach; ?>
        <div class="row mt-4">
            <section class="col text-center">
                <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" class="btn btn-outline-link btn-lg">See more on my LinkedIn profile</a>
            </section>
        </div>
    </div>


    <!-- Projects -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Projects</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col-12 col-sm-4">
                <div class="card">
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
                    <div class="card-body">
                        <h2 class="card-title">FIRKANT</h2>
                        <p class="card-text">A fast-paced, procedural platforming video game</p>
                        <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Check it out</a>
                    </div>
                </div>
            </section>
            <section class="col-12 col-sm-4">
                <div class="card">
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
                    <div class="card-body">
                        <h2 class="card-title">B2B Kolding</h2>
                        <p class="card-text">A custom Wordpress website for a local trade fair</p>
                        <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener" class="card-link">Take a look</a>
                    </div>
                </div>
            </section>
            <section class="col-12 col-sm-4">
                <div class="card">
                    <noscript>
                        <img class="card-img-top" src="<?php echo img('gm48.png') ?>" alt="GM48"/>
                    </noscript>
                    <img
                        class="card-img-top lazyload lqip"
                        src="<?php echo img('gm48-lowquality.png') ?>"
                        data-src="<?php echo img('gm48.png') ?>"
                        alt="GM48"
                    />
                    <div class="card-body">
                        <h2 class="card-title">GM48</h2>
                        <p class="card-text">A quarterly 48 hours GameMaker game jam</p>
                        <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Visit the website</a>
                    </div>
                </div>
            </section>
        </div>
        <div class="row mt-4">
            <section class="col text-center">
                <a href="/portfolio" target="_blank" rel="noopener" class="btn btn-outline-link btn-lg">Browse my portfolio for more projects</a>
            </section>
        </div>
    </div>

    <!-- Skills -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Skills</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col">
                <ul class="pl-0">
                    <li class="badge badge-light badge-lg">Web Design</li>
                    <li class="badge badge-light badge-lg">Web Development</li>
                    <li class="badge badge-light badge-lg">Bootstrap</li>
                    <li class="badge badge-light badge-lg">Laravel</li>
                    <li class="badge badge-light badge-lg">Flight</li>
                    <li class="badge badge-light badge-lg">Gulp</li>
                    <li class="badge badge-light badge-lg">npm</li>
                    <li class="badge badge-light badge-lg">JavaScript</li>
                    <li class="badge badge-light badge-lg">CSS</li>
                    <li class="badge badge-light badge-lg">SASS</li>
                    <li class="badge badge-light badge-lg">HTML</li>
                    <li class="badge badge-light badge-lg">PHP</li>
                    <li class="badge badge-light badge-lg">SQL</li>
                    <li class="badge badge-light badge-lg">SEO</li>
                </ul>
                <ul class="pl-0">
                    <li class="badge badge-light badge-lg">Game Development</li>
                    <li class="badge badge-light badge-lg">Unity3D</li>
                    <li class="badge badge-light badge-lg">C#</li>
                    <li class="badge badge-light badge-lg">Unreal Engine 4</li>
                    <li class="badge badge-light badge-lg">Blueprints Visual Scripting</li>
                    <li class="badge badge-light badge-lg">GameMaker: Studio</li>
                    <li class="badge badge-light badge-lg">GameMaker Language</li>
                    <li class="badge badge-light badge-lg">Java</li>
                    <li class="badge badge-light badge-lg">Python</li>
                    <li class="badge badge-light badge-lg">Autodesk Maya</li>
                    <li class="badge badge-light badge-lg">Autodesk Inventor</li>
                </ul>
                <ul class="pl-0">
                    <li class="badge badge-light badge-lg">Microsoft Office</li>
                    <li class="badge badge-light badge-lg">Adobe Creative Suite</li>
                    <li class="badge badge-light badge-lg">Virtual Reality</li>
                    <li class="badge badge-light badge-lg">Community Management</li>
                    <li class="badge badge-light badge-lg">Social Marketing</li>
                    <li class="badge badge-light badge-lg">Gamification</li>
                    <li class="badge badge-light badge-lg">YouTube Partnership</li>
                    <li class="badge badge-light badge-lg">SoMe</li>
                </ul>
            </section>
        </div>
        <div class="row mt-4">
            <section class="col text-center">
                <a href="https://github.com/tehwave" target="_blank" rel="noopener" class="btn btn-outline-link btn-lg">Find my skills at work on my GitHub profile</a>
            </section>
        </div>
    </div>

    <!-- Profile -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Profile</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col-2">
                    <img src="/resources/img/peter.jpg" class="img-fluid rounded-circle">
            </section>
            <section class="col-8">
                <p class="lead">I am a resourceful and creative young Danish man with lots of energy and a go-getter attitude.
                <p>I love to learn new stuff, and I strive to keep myself updated with the latest in the industry.</p>
                <p>I see my future as an employee, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.</p>
            </section>
        </div>
    </div>

    <!-- Other -->
    <div class="container">
        <div class="row">
            <section class="col">
                <h3 class="h2">Other</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col-2">
                <strong>Nationality</strong>
            </section>
            <section class="col-10">
                <p>Danish</p>
            </section>
        </div>
        <div class="row">
            <section class="col-2">
                <strong>Driver's License</strong>
            </section>
            <section class="col-10">
                <p>Yes. Type B.</p>
            </section>
        </div>
    </div>
</main>
