@extends('layouts.app')
@section('title', 'Portfolio – Peter C. Jørgensen')
@section('banner', asset('img/portfolio.jpg'))

@section('header')
    <div class="container">
        <div class="row">
            <div class="col">
                <article class="pcj-header-content">
                    <h1>Portfolio</h1>
                    <p>Throughout the years, I have accumulated various <b>ambitious</b> and <b>creative</b> projects, including <b>applications</b>, <b>games</b> and <b>websites.</b></p>
                    <p>I have worked on <b>full-fledged projects</b>, in <b>collaborative teams</b>, and with <b>reputable companies.</b></p>
                </article>
           </div>
        </div>
        <!-- Controls -->
        <div class="row mb-4 mb-md-0">
            <div class="col">
                <div class="d-md-flex justify-content-md-center">
                    <div class="btn-group mb-2 mr-sm-4" role="group" aria-label="Show All">
                        <button type="button" class="btn btn-pcj-orange" data-filter="all">All</button>
                    </div>
                    <div class="btn-group mb-2 mr-sm-4" role="group" aria-label="Filters for Type">
                        <button type="button" class="btn btn-pcj-orange" data-filter=".game">Game</button>
                        <button type="button" class="btn btn-pcj-orange" data-filter=".video">Video</button>
                        <button type="button" class="btn btn-pcj-orange" data-filter=".website">Website</button>
                        <button type="button" class="btn btn-pcj-orange" data-filter=".other">Other</button>
                    </div>
                    <div class="btn-group mb-2" role="group" aria-label="Additional Filters">
                        <button type="button" class="btn btn-pcj-orange" data-filter=".solo">Solo</button>
                        <button type="button" class="btn btn-pcj-orange" data-filter=".team">Team</button>
                        <button type="button" class="btn btn-pcj-orange" data-filter=".company">Company</button>
                    </div>
                </div>
            </div>
        </div>
   </div>
@endsection

@section('app')
    <div class="container" id="mixitup" style="margin-top: -3rem;">
        <div class="row">
            @foreach ($projects as $project)
                <div class="col-12 mx-auto mb-4 col-md-6 col-lg-4 mix {{ implode(' ', $project['filters']) }}">
                    @include('components.project')
                </div>
            @endforeach
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ mix('js/mixitup.js') }}"></script>
@endpush