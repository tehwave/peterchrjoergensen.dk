<?php

namespace App\Http\Controllers;

use App\Skill;
use App\Education;
use App\Experience;

class ResumeController extends Controller
{
    /**
     * Show Peter's resume.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke()
    {
        $educations = Education::latest('started_at')
            ->with('institution')
            ->take(2)
            ->get();

        $experiences = Experience::latest('started_at')
            ->with('company')
            ->take(3)
            ->get();

        $skills = Skill::all()
            ->groupBy('skill_group_id');

        return view('app.resume')
            ->withSkills($skills)
            ->withEducations($educations)
            ->withExperiences($experiences);
    }
}
