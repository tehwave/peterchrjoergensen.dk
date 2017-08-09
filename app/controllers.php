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
 * Controller.
 */
class Controller
{
    public function __construct()
    {
        Flight::cache('layout');
    }

    public static function home()
    {
        Flight::cache('home');
        Flight::render('home', [], 'content');

        return Flight::render('layout', [
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => ['/resources/css/home.min.css'],
        ]);
    }

    public static function cv()
    {
        Flight::cache('cv');
        Flight::render('cv', [
            'educations' => [
                [
                    'date'   => '2015 - 2017',
                    'title'  => 'Multimedia Designer',
                    'school' => 'Lillebaelt Academy',
                ],
                [
                    'date'   => '2010 - 2013',
                    'title'  => 'Higher Technical Examination',
                    'school' => 'Hansenberg',
                ],
            ],
            'experiences' => [
                [
                    'date' => '2017',
                    'title'  => 'Student Assistant',
                    'company' => 'Grundfos',
                    'summary' => [
                        'I worked on a web application, that is intended to guide visitors through a safety course before they go on tours throughout the Grundfos facilities.',
                        'Source code can be found on <a href="https://github.com/tehwave/grundfos-quiz" target="_blank" rel="noopener noreferrer">GitHub</a>',
                    ],
                ],
                [
                    'date' => '2017',
                    'title'  => 'Intern',
                    'company' => 'B2B Kolding',
                    'summary' => [
                        'I worked on the design and development of the company\'s website in Wordpress. For that purpose, I made a custom-built theme as well as implemented a new system to handle registrations from visitors and exhibitors.',
                        'I was responsible for marketing the trade fair by, for example, making the marketing plan, as well as via research, finding out what worked best in relation to our target group and budget. In addition to that, I examined the competitors. In addition, I shot several short video commercials for distribution on SoMe.',
                        'Visit the <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener noreferrer">website.</a>',
                    ],
                ],
                [
                    'date' => '2013 - 2016',
                    'title'  => 'Community Manager',
                    'company' => '/r/GameMaker via Reddit',
                    'summary' => [
                        'I volunteered to help maintain the day-to-day of the subreddit <a href="https://www.reddit.com/r/GameMaker" target="_blank" rel="noreferrer noopener">/r/GameMaker</a>, remove any unwanted posts or comments made by users with ill-intent, organize events, and brainstorm ideas. In addition, I composed plans to increase growth, and approached interesting and relevant people to host Ask-Me-Anything (AMAs) on the subreddit.',
                        'The forum consisted of over 15,000 members and received over 200,000 visitors each month at the time of my departure.',
                    ],
                ],
                [
                    'date' => '2009 - 2013',
                    'title'  => 'IT & Operation Assistant',
                    'company' => 'Janchart Shipping',
                    'summary' => [
                        'I was in charge of daily shipping routines, any computer related jobs, processing of data and management of the company website.',
                    ],
                ],
            ],
        ], 'content');

        return Flight::render('layout', [
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => ['/resources/css/cv.min.css'],
        ]);
    }

    public static function portfolio()
    {
        Flight::cache('portfolio');
        Flight::render('portfolio', ['projects' => [
            'B2B Kolding' => [
                'filters'       => ['website', 'company'],
                'image'         => 'b2bkolding',
                'image_format'  => 'png',
                'title'         => 'B2B Kolding',
                'tags'          => ['Website', 'Wordpress', 'Company'],
                'lead'          => 'B2B Kolding aims to strengthen the partnership between local businesses in Kolding, Denmark.',
                'paragraph'     => 'Using Wordpress as CMS, I developed a custom-built theme for the website, and optimized it with cache, SEO and analytics plugins.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://www.b2bkolding.dk',
            ],
            'GM48' => [
                'filters'       => ['website', 'solo'],
                'image'         => 'gm48',
                'image_format'  => 'png',
                'title'         => 'GM48',
                'tags'          => ['Website', 'PHP', 'Solo'],
                'lead'          => 'The gm(48) is a quarterly 48 hours GameMaker game jam from the community of /r/GameMaker.',
                'paragraph'     => 'I wrote the website in PHP, HTML, SASS and JS using the Laravel, Bootstrap and VueJS frameworks.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://gm48.net',
            ],
            'Grundfos Safety'   => [
                'filters'       => ['website', 'company'],
                'image'         => 'grundfos',
                'image_format'  => 'png',
                'title'         => 'Grundfos Safety',
                'tags'          => ['Website', 'JavaScript', 'Company'],
                'lead'          => 'A safety instructions and quiz web application for visitors to the Grundfos facilities.',
                'paragraph'     => 'The web application was written in VueJS, and has editable files, translations and support for browsers from IE9 and up.',
                'button_text'   => 'Check it out',
                'button_url'    => 'https://tehwave.github.io/grundfos-quiz/',
            ],
            'My Website' => [
                'filters'       => ['website', 'solo'],
                'image'         => 'website',
                'image_format'  => 'png',
                'title'         => 'My Website',
                'tags'          => ['Website', 'PHP', 'Solo'],
                'lead'          => 'My personal website complete with landing page, portfolio, curriculum vitae and blog.',
                'paragraph'     => 'I wrote the website to be fast using the Flight PHP micro-framework via Composer. I use MixItUp 3 for display & filtering of projects.',
                'button_text'   => 'Browse code',
                'button_url'    => 'https://github.com/tehwave/peterchrjoergensen.dk',
            ],
            'FIRKANT' => [
                'filters'       => ['game', 'solo'],
                'image'         => 'firkant',
                'image_format'  => 'png',
                'title'         => 'FIRKANT',
                'tags'          => ['Game', 'GameMaker: Studio', 'Solo'],
                'lead'          => 'FIRKANT is a a fast-paced, procedural platformer inspired by Cloudberry Kingdom and Super Meat Boy.',
                'paragraph'     => 'Made in GameMaker: Studio, it\'s planned for release on mobile platforms in late 2017. For more information, please visit the website.',
                'button_text'   => 'Check it out',
                'button_url'    => '/FIRKANT',
            ],
            'The Author' => [
                'filters'       => ['video', 'team'],
                'image'         => 'author',
                'image_format'  => 'jpg',
                'title'         => 'The Author',
                'tags'          => ['Video', 'Premiere Pro', 'Team'],
                'lead'          => 'An author with writer\'s block goes to an abandoned house for inspiration, but find things getting too real.',
                'paragraph'     => 'I starred in the short film as the main character. It was colorgraded and edited in Adobe Premiere Pro by me as well.',
                'button_text'   => 'Watch it',
                'button_url'    => 'https://www.youtube.com/watch?v=S0bQYYnhtGk',
            ],
            'Western World' => [
                'filters'       => ['application', 'team'],
                'image'         => 'western',
                'image_format'  => 'jpg',
                'title'         => 'Western World',
                'tags'          => ['Application', 'Unity3D', 'Team'],
                'lead'          => 'A small, atmospheric town, that was inspired by the good, old Western films, to explore around in.',
                'paragraph'     => 'Made in Unity3D as a school project, it was meant to teach us the asset pipeline between Maya and Unity.',
                'button_text'   => 'Watch the trailer',
                'button_url'    => 'https://www.youtube.com/watch?v=0SeTUIsS5sQ',
            ],
            'Showreel - 2015' => [
                'filters'       => ['video', 'solo'],
                'image'         => 'showreel',
                'image_format'  => 'jpg',
                'title'         => 'Showreel - 2015',
                'tags'          => ['Video', 'Premiere Pro', 'Solo'],
                'lead'          => 'A showreel for various school projects that I completed during my first two semesters in 2015.',
                'paragraph'     => 'Edited in Premiere Pro, it was important for me that the music matched the editing, so that it was exciting to watch.',
                'button_text'   => 'Watch it',
                'button_url'    => 'https://www.youtube.com/watch?v=cYLeWeJryOQ',
            ],
            'Mord Ombord' => [
                'filters'       => ['game', 'team'],
                'image'         => 'mordombord',
                'image_format'  => 'png',
                'title'         => 'Mord Ombord',
                'tags'          => ['Game', 'Unity3D', 'Team'],
                'lead'          => 'Solve mysteries and puzzles using learning material in Virtual Reality as part of your school education.',
                'paragraph'     => 'Developed in Unity3D for use with Google Cardboard, I had to heavily optimize the game to run on old devices.',
                'button_text'   => 'Watch trailer',
                'button_url'    => 'https://www.youtube.com/watch?v=0U42shiUG2w',
            ],
            'Odense Golfklub' => [
                'filters'       => ['application', 'team'],
                'image'         => 'odensegolfklub',
                'image_format'  => 'png',
                'title'         => 'Odense Golfklub',
                'tags'          => ['Application', 'Unity3D', 'Team'],
                'lead'          => 'A mobile application for the members of Odense Golfklub with 360° imagery and 3D models of golf courses.',
                'paragraph'     => 'Developed in Unity3D for its ease with 3D, I had to write custom functionality to handle the display of 360° imagery.',
            ],
        ]], 'content');

        return Flight::render('layout', [
            'title'         => 'Peter C. Jørgensen',
            'description'   => 'The personal website of Peter C. Jørgensen. It includes his portfolio, curriculum vitae, and blog.',
            'stylesheets'   => ['/resources/css/portfolio.min.css'],
            'scripts'       => ['/resources/js/lazysizes.min.js', '/resources/js/mixitup.min.js', '/resources/js/portfolio.js'],
        ]);
    }
}
