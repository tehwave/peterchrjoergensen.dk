@extends('layouts.app')

@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">
        <div class="container text-white">
            <div class="row my-4 my-xl-6">
                <div class="col-12 col-md-4">
                    <h1>Résumé</h1>
                </div>
                <div class="col-12 col-md mt-md-2">
                    <p class="h3">I am a <b>Web Developer</b> from <b>Denmark</b> with a speciality in <b>PHP</b>.
                </div>
            </div>
        </div>
    </div>

    <!-- Projects -->
    <div class="container mt-n4 mt-xl-n6">
        <div class="row">
            <div class="col">
                <div class="card-deck mb-4">
                    <div class="card shadow-md overflow-hidden">
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
                    <div class="card shadow-md overflow-hidden">
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
                    <div class="card shadow-md overflow-hidden">
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
    </div>
@endsection