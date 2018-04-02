<?php

namespace App\Http\Controllers;

class CurriculumVitaeController extends Controller
{
    /**
     * Shows curriculum vitae.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $educations = [
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
        ];

        $experiences = [
            [
                'date'    => '2017 -',
                'title'   => 'Customer Support Agent',
                'company' => 'YouSee',
                'summary' => [
                    'I work over-the-phone by supporting, selling and advising customers on YouSee products, ensuring that any problems are remedied, solutions are found, and that the customer has felt well treated.',
                ],
            ],
            [
                'date'    => '2017',
                'title'   => 'Student Assistant',
                'company' => 'Grundfos',
                'summary' => [
                    'I designed and developed a web application intended to guide visitors through a safety course before they go on tours throughout the Grundfos facilities.',
                    'Source code located on my <a href="https://github.com/tehwave/grundfos-quiz" target="_blank" rel="noopener noreferrer">GitHub</a> page.',
                ],
            ],
            [
                'date'    => '2017',
                'title'   => 'Intern',
                'company' => 'B2B Kolding',
                'summary' => [
                    'I designed and developed the company\'s website in Wordpress. For that purpose, I made a custom-built theme as well as implemented a new system to handle registrations from visitors and exhibitors.',
                    'I was responsible for marketing the trade fair by drafting the marketing plan as well as finding out via research what worked best in relation to the target group and limited budget.',
                    'In addition, I shot several short video commercials for distribution on SoMe.',
                    'Visit the <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener noreferrer">website.</a>',
                ],
            ],
            [
                'date'    => '2013 - 2016',
                'title'   => 'Community Manager',
                'company' => 'Reddit',
                'summary' => [
                    'I volunteered to help maintain the day-to-day of the forum <a href="https://www.reddit.com/r/GameMaker" target="_blank" rel="noreferrer noopener">/r/GameMaker</a>, remove any unwanted posts or comments made by users with ill-intent, organize events, and brainstorm ideas.',
                    'In addition, I composed plans to increase growth, and approached interesting & relevant people to host Ask-Me-Anything (AMAs) on the forum.',
                    'The forum consisted of over 15,000 members and received over 200,000 visitors each month at the time of my departure.',
                ],
            ],
        ];

        return view('app.cv', compact('educations', 'experiences'));
    }

    /**
     * Redirect to main route.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirect()
    {
        return redirect()->route('curriculum-vitae');
    }
}
