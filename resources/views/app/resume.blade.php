@extends('layouts.app')
@section('title', 'Résumé | Peter C. Jørgensen')
@section('description', 'I see my future as someone, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.')

@section('app')

    <div class="jumbotron mb-0 bg-secondary pattern-waves">
        <div class="container text-white">
            <div class="row my-4 my-xl-6">
                <div class="col-12 col-md-4 my-auto">
                    <h1>Résumé</h1>
                </div>
                <div class="col-12 col-md mt-md-2">
                    <p class="h3">I see <b>my future</b> as someone, who is <b>respected</b> by my co-workers for my <b>knowledge</b>, <b>skill</b> and <b>sharp senses</b> as well as <b>cheerfulness</b>.
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-4 mt-md-n6">
        <!-- Experience -->
        <div class="row px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Experience</h2>
            </div>
            <div class="col-4 text-right">
                <a class="text-muted font-size-base card-link" href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener">Learn more</a>
            </div>
        </div>
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <div class="card-deck">
                    @foreach ($experiences as $experience)
                        <div class="card shadow">
                            <div class="card-header @if ($loop->first) bg-accent text-white @endif">
                                {{ $experience->date }}
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">
                                    {{ $experience->title }}
                                    <small class="text-muted">{{ $experience->company->name }}</small>
                                </h3>
                                <p class="card-text">{!! $experience->summary !!}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Portfolio -->
        <div class="row px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Portfolio</h2>
            </div>
            <div class="col-4 text-right">
                <a class="text-muted font-size-base card-link" href="{{ route('portfolio') }}" target="_blank" rel="noopener">View all</a>
            </div>
        </div>
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <div class="card-deck">
                    <div class="card shadow overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/firkant-lowquality.png') }}"
                            data-src="{{ asset('img/firkant.png') }}"
                            alt="FIRKANT"
                        />
                        <section class="card-body">
                            <h2 class="card-title">FIRKANT</h2>
                            <p class="card-text">A fast-paced, procedural platforming video game</p>
                        </section>
                        <footer class="card-footer bg-white border-top-0">
                            <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </div>
                    <div class="card shadow overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/grundfos-lowquality.png') }}"
                            data-src="{{ asset('img/grundfos.png') }}"
                            alt="Grundfos"
                        />
                        <section class="card-body">
                            <h2 class="card-title">Grundfos Safety</h2>
                            <p class="card-text">A safety instructions and quiz web application for visitors to the Grundfos facilities</p>
                        </section>
                        <footer class="card-footer bg-white border-top-0">
                            <a href="https://tehwave.github.io/grundfos-quiz/" target="_blank" rel="noopener" class="card-link">Example</a>
                            <a href="https://github.com/tehwave/grundfos-quiz/" target="_blank" rel="noopener" class="card-link">GitHub</a>
                        </footer>
                    </div>
                    <div class="card shadow overflow-hidden">
                        <img
                            class="card-img-top"
                            data-lazy
                            src="{{ asset('img/gm48-lowquality.png') }}"
                            data-src="{{ asset('img/gm48.png') }}"
                            alt="GM48"
                        />
                        <section class="card-body">
                            <h2 class="card-title">GM48</h2>
                            <p class="card-text">A games development competition</p>
                        </section>
                        <footer class="card-footer bg-white">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </div>
                </div>
            </div>
        </div>

        <!-- Education -->
        <div class="row px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Education</h2>
            </div>
        </div>
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <div class="card-deck">
                    @foreach ($educations as $education)
                        <div class="card shadow">
                            <div class="card-header">
                                {{ $education->date }}
                            </div>
                            <div class="card-body">
                                <h3 class="card-title">
                                    {{ $education->title }}
                                    <small class="text-muted">{{ $education->institution->name }}</small>
                                </h3>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Skill -->
        <div class="row px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Skills</h2>
            </div>
        </div>
        <div class="row mb-2 mb-xl-5">
            <div class="col col-xl-8">
                @foreach ($skills as $skillsByGroup)
                    <ul class="pl-0">
                        @foreach ($skillsByGroup as $skill)
                            <li class="badge badge-secondary badge-md shadow rounded-lg mb-2 px-4">{{ $skill->name }}</li>
                        @endforeach
                    </ul>
                @endforeach
            </div>
        </div>

        <!-- Misc -->
        <div class="row px-3 mb-2">
            <div class="col-8">
                <h2 class="text-muted h6">Misc.</h2>
            </div>
        </div>
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <ul class="list-group shadow rounded-lg">
                    <li class="list-group-item">
                        <strong>Nationality</strong>
                        <div>Danish</div>
                    </li>
                    <li class="list-group-item">
                        <strong>Age</strong>
                        <div>{{ now()->year - 1993 }}</div>
                    </li>
                    <li class="list-group-item">
                        <strong>Driver's License</strong>
                        <div>Type B</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection