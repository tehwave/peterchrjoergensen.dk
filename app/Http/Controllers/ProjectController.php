<?php

namespace App\Http\Controllers;

use Cache;
use App\Project;

class ProjectController extends Controller
{
    /**
     * Shows listing of projects.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $projects = Cache::remember('home.projects', now()->addHour(), function () {
            $projects = Project::all();

            // return $projects;
        // });

        return view('app.project.index')
            ->withProjects($projects);
    }
}
