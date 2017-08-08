<?php

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
|
| This file is where all of the controllers that are handled
| by the application are defined.
|
*/

/**
* Controller
*/
class Controller
{
    function __construct ()
    {
        Flight::cache('layout');
    }

    public static function home ()
    {
        Flight::cache('home');
        Flight::render('home', array(), 'content');

        return Flight::render('layout', array(
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => array('/resources/css/home.min.css')
        ));
    }

    public static function cv ()
    {
        Flight::cache('cv');
        Flight::render('cv', array(), 'content');

        return Flight::render('layout', array(
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => array('/resources/css/cv.min.css')
        ));
    }

    public static function portfolio ()
    {
        Flight::cache('portfolio');
        Flight::render('portfolio', array('projects' => array(
            'B2B Kolding' => array(
                'filters'       => array('website', 'company'),
                'image'         => 'b2bkolding',
                'image_format'  => 'png',
                'title'         => 'B2B Kolding',
                'tags'          => array('Website', 'Wordpress', 'Company'),
                'lead'          => 'B2B Kolding aims to strengthen the partnership between local businesses in Kolding, Denmark.',
                'paragraph'     => 'Using Wordpress as CMS, I developed a custom-built theme for the website, and optimized it with cache, SEO and analytics plugins.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://www.b2bkolding.dk'
            ),
            'GM48' => array(
                'filters'       => array('website', 'solo'),
                'image'         => 'gm48',
                'image_format'  => 'png',
                'title'         => 'GM48',
                'tags'          => array('Website', 'PHP', 'Solo'),
                'lead'          => 'The gm(48) is a quarterly 48 hours GameMaker game jam from the community of /r/GameMaker.',
                'paragraph'     => 'I wrote the website in PHP, HTML, SASS and JS using the Laravel, Bootstrap and VueJS frameworks.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://gm48.net'
            ),
            'Grundfos Safety'   => array(
                'filters'       => array('website', 'company'),
                'image'         => 'grundfos',
                'image_format'  => 'png',
                'title'         => 'Grundfos Safety',
                'tags'          => array('Website', 'JavaScript', 'Company'),
                'lead'          => 'A safety instructions and quiz web application for visitors to the Grundfos facilities.',
                'paragraph'     => 'The web application was written in VueJS, and has editable files, translations and support for browsers from IE9 and up.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://tehwave.github.io/grundfos-quiz/'
            ),
            'My Website' => array(
                'filters'       => array('website', 'solo'),
                'image'         => 'website',
                'image_format'  => 'png',
                'title'         => 'My Website',
                'tags'          => array('Website', 'HTML / CSS / JS', 'Solo'),
                'lead'          => 'My personal website complete with landing page, portfolio, curriculum vitae and blog.',
                'paragraph'     => 'I wrote the website to be static and fast using plain HTML, CSS and JS. I used MixItUp 3 for display & filtering of projects.',
                'button_text'   => 'Browse code',
                'button_url'    => 'https://github.com/tehwave/peterchrjoergensen.dk'
            ),
            'FIRKANT' => array(
                'filters'       => array('game', 'solo'),
                'image'         => 'firkant',
                'image_format'  => 'png',
                'title'         => 'FIRKANT',
                'tags'          => array('Game', 'GameMaker: Studio', 'Solo'),
                'lead'          => 'FIRKANT is a a fast-paced, procedural platformer inspired by Cloudberry Kingdom and Super Meat Boy.',
                'paragraph'     => 'Made in GameMaker: Studio, it\'s planned for release on mobile platforms in late 2017. For more information, please visit the website.',
                'button_text'   => 'Check it out',
                'button_url'    => '/FIRKANT'
            ),
            'The Author' => array(
                'filters'       => array('video', 'team'),
                'image'         => 'author',
                'image_format'  => 'jpg',
                'title'         => 'The Author',
                'tags'          => array('Video', 'Premiere Pro', 'Team'),
                'lead'          => 'An author with writer\'s block goes to an abandoned house for inspiration, but find things getting too real.',
                'paragraph'     => 'I starred in the short film as the main character. It was colorgraded and edited in Adobe Premiere Pro by me as well.',
                'button_text'   => 'Watch it',
                'button_url'    => 'https://www.youtube.com/watch?v=S0bQYYnhtGk'
            ),
            'Western World' => array(
                'filters'       => array('application', 'team'),
                'image'         => 'western',
                'image_format'  => 'jpg',
                'title'         => 'Western World',
                'tags'          => array('Application', 'Unity3D', 'Team'),
                'lead'          => 'A small, atmospheric town, that was inspired by the good, old Western films, to explore around in.',
                'paragraph'     => 'Made in Unity3D as a school project, it was meant to teach us the asset pipeline between Maya and Unity.',
                'button_text'   => 'Watch the trailer',
                'button_url'    => 'https://www.youtube.com/watch?v=0SeTUIsS5sQ'
            ),
            'Showreel - 2015' => array(
                'filters'       => array('video', 'solo'),
                'image'         => 'showreel',
                'image_format'  => 'jpg',
                'title'         => 'Showreel - 2015',
                'tags'          => array('Video', 'Premiere Pro', 'Solo'),
                'lead'          => 'A showreel for various school projects that I completed during my first two semesters in 2015.',
                'paragraph'     => 'Edited in Premiere Pro, it was important for me that the music matched the editing, so that it was exciting to watch.',
                'button_text'   => 'Watch it',
                'button_url'    => 'https://www.youtube.com/watch?v=cYLeWeJryOQ'
            ),
            'Mord Ombord' => array(
                'filters'       => array('game', 'team'),
                'image'         => 'mordombord',
                'image_format'  => 'png',
                'title'         => 'Mord Ombord',
                'tags'          => array('Game', 'Unity3D', 'Team'),
                'lead'          => 'Solve mysteries and puzzles using learning material in Virtual Reality as part of your school education.',
                'paragraph'     => 'Developed in Unity3D for use with Google Cardboard, I had to heavily optimize the game to run on old devices.',
                'button_text'   => 'Watch trailer',
                'button_url'    => 'https://www.youtube.com/watch?v=0U42shiUG2w'
            ),
            'Odense Golfklub' => array(
                'filters'       => array('application', 'team'),
                'image'         => 'odensegolfklub',
                'image_format'  => 'png',
                'title'         => 'Odense Golfklub',
                'tags'          => array('Application', 'Unity3D', 'Team'),
                'lead'          => 'A mobile application for the members of Odense Golfklub with 360° imagery and 3D models of golf courses.',
                'paragraph'     => 'Developed in Unity3D for its ease with 3D, I had to write custom functionality to handle the display of 360° imagery.',
                'button_text'   => 'Download APK',
                'button_url'    => 'files/OdenseGolfklub.apk'
            ),
        )), 'content');

        return Flight::render('layout', array(
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => array('/resources/css/portfolio.min.css'),
            'scripts'       => array('/resources/js/lazysizes.min.js', '/resources/js/mixitup.min.js', '/resources/js/portfolio.js')
        ));
    }
}