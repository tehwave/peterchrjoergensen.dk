<?php

namespace App\Http\Controllers;

class ResumeController extends Controller
{
    /**
     * Show Peter's resume.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke()
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
                'date'    => '2018 - ',
                'title'   => 'Web Developer',
                'company' => 'Webstarters.dk',
                'summary' => [
                ],
            ],
            [
                'date'    => '2017 - 2018',
                'title'   => 'Customer Support Agent',
                'company' => 'YouSee',
                'summary' => [
                    'I worked over-the-phone supporting, selling and advising customers on YouSee products, ensuring that any problems are remedied, solutions are found, and that the customer has felt well treated.',
                ],
            ],
            [
                'date'    => '2017',
                'title'   => 'Student Assistant',
                'company' => 'Grundfos',
                'summary' => [
                    'I designed and developed a web application intended to guide visitors through a safety course before they go on tours throughout the Grundfos facilities.',
                ],
            ],
        ];

        return view('app.resume')
            ->withEducations($educations)
            ->withExperiences($experiences);
    }
}
