@extends('layouts.app')

@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">
        <div class="container text-white">
            <div class="row mt-4 mt-xl-6">
                <div class="col-12 col-md-4">
                    <h1>Portfolio</h1>
                </div>
                <div class="col-12 col-md mt-md-2">
                    <p class="h3">
                        I have worked on <b>ambitious</b> projects, in <b>collaborative</b> teams, and with <b>reputable</b> companies.
                    </p>
                </div>
            </div>
            <div class="my-4 my-xl-6">
                <div class="d-md-flex justify-content-md-center overflow-hidden">
                    <div class="btn-group mb-2 mr-md-4" role="group" aria-label="Show All">
                        <button type="button" class="btn btn-accent font-medium px-5 px-md-4 px-lg-5" data-filter="all">All</button>
                    </div>
                    <div class="btn-group mb-2 mr-md-4" role="group" aria-label="Filters for Type">
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".game">Game</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".video">Video</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".website">Website</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".other">Other</button>
                    </div>
                    <div class="btn-group mb-2" role="group" aria-label="Additional Filters">
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".solo">Solo</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".team">Team</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".company">Company</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-4 mt-md-n6">
        <div class="row mb-4 mb-xl-6">
            @foreach ($projects as $project)
                <div class="col-12 mx-auto mb-4 col-md-6 col-lg-4 mix {{ implode(' ', $project['filters']) }}">
                    @component('components.project')

                    @endcomponent
                </div>
            @endforeach
        </div>
    </div>
@endsection