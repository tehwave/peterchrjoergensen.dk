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
        $projects = Project::all();

        return view('app.project.index')
            ->withProjects($projects);
    }
}
