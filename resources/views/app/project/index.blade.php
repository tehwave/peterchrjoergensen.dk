@extends('layouts.app')
@section('title', 'Projects | Peter C. Jørgensen')
@section('description', 'I have worked on ambitious projects, in collaborative teams, and with reputable companies.')

@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">
        <div class="container text-white">
            <div class="row mt-4 mt-xl-6">
                <div class="col-12 col-md-4">
                    <h1>Portfolio</h1>
                    <div class="divider my-4"></div>
                </div>
                <div class="col-12 col-md mt-md-2">
                    <p class="h3">
                        I have worked on <b>ambitious</b> projects, in <b>collaborative</b> teams, and with <b>reputable</b> companies.
                    </p>
                </div>
            </div>
            <div class="my-4 my-xl-6">
                <div class="d-md-flex justify-content-md-center">
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
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".institution">Team</button>
                        <button type="button" class="btn btn-accent font-medium px-4 px-md-3 px-lg-4" data-filter=".company">Company</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-4 mt-md-n6" id="mixitup">
        <div class="row">
            @foreach ($projects as $project)
                <div class="col-12 mx-auto mb-4 col-md-6 col-lg-4 mix {{ $project->filters }}">
                    @component('components.project', ['project' => $project]) @endcomponent
                </div>
            @endforeach
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ mix('js/mixitup.js') }}"></script>
@endpush