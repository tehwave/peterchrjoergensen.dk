<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Shows listing of projects
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $projects = [
            'B2B Kolding' => [
                'filters'       => ['website', 'company'],
                'image'         => 'b2bkolding',
                'image_format'  => 'png',
                'title'         => 'B2B Kolding',
                'tags'          => ['Website', 'Wordpress', 'Company'],
                'lead'          => 'B2B Kolding aims to strengthen the partnership between local businesses in Kolding, Denmark.',
                'paragraph'     => 'Using Wordpress as CMS, I developed a custom-built theme for the website, and optimized it with cache, SEO and analytics plugins.',
                'link_text'   => 'Website',
                'link'    => 'https://www.b2bkolding.dk',
            ],
            'GM48' => [
                'filters'       => ['website', 'solo'],
                'image'         => 'gm48',
                'image_format'  => 'png',
                'title'         => 'GM48',
                'tags'          => ['Website', 'PHP', 'Solo'],
                'lead'          => 'The gm(48) is a quarterly 48 hours GameMaker game jam from the community of /r/GameMaker.',
                'paragraph'     => 'I wrote the website in PHP, HTML, SASS and JS using the Laravel, Bootstrap and VueJS frameworks.',
                'link_text'   => 'Website',
                'link'    => 'https://gm48.net',
            ],
            'Grundfos Safety'   => [
                'filters'       => ['website', 'company'],
                'image'         => 'grundfos',
                'image_format'  => 'png',
                'title'         => 'Grundfos Safety',
                'tags'          => ['Website', 'JavaScript', 'Company'],
                'lead'          => 'A safety instructions and quiz web application for visitors to the Grundfos facilities.',
                'paragraph'     => 'The web application was written in VueJS, and has editable files, translations and support for browsers from IE9 and up.',
                'link_text'   => 'GitHub Repository',
                'link'    => 'https://tehwave.github.io/grundfos-quiz/',
            ],
            'My Website' => [
                'filters'       => ['website', 'solo'],
                'image'         => 'website',
                'image_format'  => 'png',
                'title'         => 'My Website',
                'tags'          => ['Website', 'PHP', 'Solo'],
                'lead'          => 'My personal website complete with landing page, portfolio, curriculum vitae and blog.',
                'paragraph'     => 'I wrote the website to be fast using the Flight PHP micro-framework via Composer. I use MixItUp 3 for display & filtering of projects.',
                'link_text'   => 'GitHub Repository',
                'link'    => 'https://github.com/tehwave/peterchrjoergensen.dk',
            ],
            'FIRKANT' => [
                'filters'       => ['game', 'solo'],
                'image'         => 'firkant',
                'image_format'  => 'png',
                'title'         => 'FIRKANT',
                'tags'          => ['Game', 'GameMaker: Studio', 'Solo'],
                'lead'          => 'FIRKANT is a a fast-paced, procedural platformer inspired by Cloudberry Kingdom and Super Meat Boy.',
                'paragraph'     => 'Made in GameMaker: Studio, it\'s planned for release on mobile platforms in late 2017. For more information, please visit the website.',
                'link_text'   => 'Website',
                'link'    => '/FIRKANT',
            ],
            'Lennarth Hansen' => [
                'filters'       => ['other', 'solo'],
                'image'         => 'lennarthhansen',
                'image_format'  => 'png',
                'title'         => 'Lennarth Hansen',
                'tags'          => ['Other', 'Adobe Creative Suite', 'Solo'],
                'lead'          => 'Lennarth Hansen is a local politician in Kolding.',
                'paragraph'     => 'I have been contracted to create graphic designs, e.g. stickers and posters, for his campaign as well as help manage his Facebook-page.',
                'link_text'   => 'Facebook',
                'link'    => 'https://www.facebook.com/stemlennarth/',
            ],
            'The Author' => [
                'filters'       => ['video', 'team'],
                'image'         => 'author',
                'image_format'  => 'jpg',
                'title'         => 'The Author',
                'tags'          => ['Video', 'Premiere Pro', 'Team'],
                'lead'          => 'An author with writer\'s block goes to an abandoned house for inspiration, but find things getting too real.',
                'paragraph'     => 'I starred in the short film as the main character. It was colorgraded and edited in Adobe Premiere Pro by me as well.',
                'link_text'   => 'YouTube',
                'link'    => 'https://www.youtube.com/watch?v=S0bQYYnhtGk',
            ],
            'Western World' => [
                'filters'       => ['other', 'team'],
                'image'         => 'western',
                'image_format'  => 'jpg',
                'title'         => 'Western World',
                'tags'          => ['Other', 'Unity3D', 'Team'],
                'lead'          => 'A small, atmospheric town, that was inspired by the good, old Western films, to explore around in.',
                'paragraph'     => 'Made in Unity3D as a school project, it was meant to teach us the asset pipeline between Maya and Unity.',
                'link_text'   => 'Trailer',
                'link'    => 'https://www.youtube.com/watch?v=0SeTUIsS5sQ',
            ],
            'Showreel - 2015' => [
                'filters'       => ['video', 'solo'],
                'image'         => 'showreel',
                'image_format'  => 'jpg',
                'title'         => 'Showreel - 2015',
                'tags'          => ['Video', 'Premiere Pro', 'Solo'],
                'lead'          => 'A showreel for various school projects that I completed during my first two semesters in 2015.',
                'paragraph'     => 'Edited in Premiere Pro, it was important for me that the music matched the editing, so that it was exciting to watch.',
                'link_text'   => 'YouTube',
                'link'    => 'https://www.youtube.com/watch?v=cYLeWeJryOQ',
            ],
            'Mord Ombord' => [
                'filters'       => ['game', 'team'],
                'image'         => 'mordombord',
                'image_format'  => 'png',
                'title'         => 'Mord Ombord',
                'tags'          => ['Game', 'Unity3D', 'Team'],
                'lead'          => 'Solve mysteries and puzzles using learning material in Virtual Reality as part of your school education.',
                'paragraph'     => 'Developed in Unity3D for use with Google Cardboard, I had to heavily optimize the game to run on old devices.',
                'link_text'   => 'Trailer',
                'link'    => 'https://www.youtube.com/watch?v=0U42shiUG2w',
            ],
            'Odense Golfklub' => [
                'filters'       => ['other', 'team'],
                'image'         => 'odensegolfklub',
                'image_format'  => 'png',
                'title'         => 'Odense Golfklub',
                'tags'          => ['Other', 'Unity3D', 'Team'],
                'lead'          => 'A mobile application for the members of Odense Golfklub with 360° imagery and 3D models of golf courses.',
                'paragraph'     => 'Developed in Unity3D for its ease with 3D, I had to write custom functionality to handle the display of 360° imagery.',
            ]
        ];

        return view('app.portfolio', compact('projects'));
    }
}
