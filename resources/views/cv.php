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
            <section class="twelve columns">
                <h2>Curriculum Vitae</h2>
            </section>
        </div>
    </section>

    <!-- Download -->
    <div class="container">
        <section class="twelve columns">
            <a href="/resources/files/CV-Peter-Christian-Jørgensen-English.pdf" target="_blank" rel="noopener noreferrer" class="button">
                <img src="/resources/img/download.png" height="8">
                Download &nbsp; (English <img src="/resources/img/english.png" width="16"> )
            </a>
            <a href="/resources/files/CV-Peter-Christian-Jørgensen-Dansk.pdf" target="_blank" rel="noopener noreferrer" class="button">
                <img src="/resources/img/download.png" height="8">
                Download &nbsp; (Dansk <img src="/resources/img/dansk.png" width="16"> )
            </a>
        </section>
    </div>

    <!-- Education -->
    <div class="container" style="margin-top: 20px;">
        <section class="twelve columns">
            <h2>Education</h2>
            <hr>
        </section>
    </div>
    <?php foreach ($educations as $education) : ?>
        <div class="container">
            <section class="two columns">
                <?php echo $education['date'] ?>
            </section>
            <section class="eight columns">
                <h3>
                    <?php echo $education['title'] ?>
                    <small><?php echo $education['school'] ?></small>
                </h3>
            </section>
        </div>
    <?php endforeach; ?>

    <!-- Experience -->
    <div class="container" style="margin-top: 20px;">
        <section class="twelve columns">
            <h2>Experience</h2>
            <hr>
        </section>
    </div>
    <?php foreach ($experiences as $experience) : ?>
    <div class="container">
        <section class="two columns">
            <?php echo $experience['date'] ?>
        </section>
        <section class="eight columns">
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
    <div class="container">
        <section class="two columns">
            <p>See more on my <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener">LinkedIn</a> profile.</p>
        </section>
    </div>

    <!-- Projects -->
    <div class="container" style="margin-top: 20px;">
        <section class="twelve columns">
            <h2>Projects</h2>
            <hr>
        </section>
    </div>
    <div class="container">
        <section class="two columns">
            2016 -
        </section>
        <section class="eight columns">
            <strong>FIRKANT</strong>
            <div>Mobile game for Android & iOS</div>
            <small><p>FIRKANT is a fast-paced, procuderal platformer. It is being developed in GameMaker: Studio, and is planned for release in late 2017.</p></small>
        </section>
    </div>
    <div class="container">
        <section class="two columns">
            2013 -
        </section>
        <section class="eight columns">
            <strong>Game Development Competition</strong>
            <div>https://gm48.net</div>
            <small><p>A quarterly, non-profit games development competition, better known as a game jam, in which the participants use the integrated development environment, GameMaker, to develop games from scratch in just 48 hours.</p></small>
        </section>
    </div>
    <div class="container">
        <section class="two columns">
            <p>See more on my <a href="/portfolio">portfolio</a>.</p>
        </section>
    </div>

    <!-- Profile -->
    <div class="container" style="margin-top: 20px;">
        <section class="twelve columns">
            <h2>Profile</h2>
            <hr>
        </section>
    </div>
    <div class="container">
        <section class="ten columns">
            <p>I am a resourceful and creative young Danish man with lots of energy and a go-getter attitude.
            <p>I love to learn new stuff, and I strive to keep myself updated with the latest in the industry.</p>
            <p>I see my future as an employee, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.</p>
        </section>
    </div>

    <!-- Skills -->
    <div class="container" style="margin-top: 20px;">
        <section class="twelve columns">
            <h2>Skills</h2>
            <hr>
        </section>
    </div>
    <div class="container">
        <section class="ten columns">
            <ul class="skills">
                <li class="skill">Web Design</li>
                <li class="skill">Web Development</li>
                <li class="skill">Bootstrap</li>
                <li class="skill">Laravel</li>
                <li class="skill">Flight</li>
                <li class="skill">Gulp</li>
                <li class="skill">npm</li>
                <li class="skill">JavaScript</li>
                <li class="skill">CSS</li>
                <li class="skill">SASS</li>
                <li class="skill">HTML</li>
                <li class="skill">PHP</li>
                <li class="skill">SQL</li>
                <li class="skill">SEO</li>
            </ul>
            <ul class="skills">
                <li class="skill">Game Development</li>
                <li class="skill">Unity3D</li>
                <li class="skill">C#</li>
                <li class="skill">Unreal Engine 4</li>
                <li class="skill">Blueprints Visual Scripting</li>
                <li class="skill">GameMaker: Studio</li>
                <li class="skill">GameMaker Language</li>
                <li class="skill">Java</li>
                <li class="skill">Python</li>
                <li class="skill">Autodesk Maya</li>
                <li class="skill">Autodesk Inventor</li>
            </ul>

            <ul class="skills">
                <li class="skill">Microsoft Office</li>
                <li class="skill">Adobe Creative Suite</li>
                <li class="skill">Virtual Reality</li>
                <li class="skill">Community Management</li>
                <li class="skill">Social Marketing</li>
                <li class="skill">Gamification</li>
                <li class="skill">YouTube Partnership</li>
                <li class="skill">SoMe</li>
            </ul>
        </section>
    </div>
</main>
