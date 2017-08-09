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
            See more on my <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener">LinkedIn</a> profile.
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
            See more on my <a href="/portfolio">portfolio</a>.
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
            <p>
                I see my future as an employee, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.
            </p>
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
            <section class="skills">
                <span class="skill">Web Design</span>
                <span class="skill">Web Development</span>
                <span class="skill">Bootstrap</span>
                <span class="skill">Laravel</span>
                <span class="skill">Flight</span>
                <span class="skill">Gulp</span>
                <span class="skill">npm</span>
                <span class="skill">JavaScript</span>
                <span class="skill">CSS</span>
                <span class="skill">SASS</span>
                <span class="skill">HTML</span>
                <span class="skill">PHP</span>
                <span class="skill">SQL</span>
                <span class="skill">SEO</span>
            </section>
            <section class="skills">
                <span class="skill">Game Development</span>
                <span class="skill">Unity3D</span>
                <span class="skill">C#</span>
                <span class="skill">Unreal Engine 4</span>
                <span class="skill">Blueprints Visual Scripting</span>
                <span class="skill">GameMaker: Studio</span>
                <span class="skill">GameMaker Language</span>
                <span class="skill">Java</span>
                <span class="skill">Python</span>
                <span class="skill">Autodesk Maya</span>
                <span class="skill">Autodesk Inventor</span>
            </section>

            <section class="skills">
                <span class="skill">Microsoft Office</span>
                <span class="skill">Adobe Creative Suite</span>
                <span class="skill">Virtual Reality</span>
                <span class="skill">Community Management</span>
                <span class="skill">Social Marketing</span>
                <span class="skill">SoMe</span>
            </section>
        </section>
    </div>
</main>
