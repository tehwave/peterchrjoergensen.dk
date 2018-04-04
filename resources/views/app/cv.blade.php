@extends('layouts.app')
@section('title', 'Curriculum Vitae – Peter C. Jørgensen')
@section('banner', asset('img/cv.jpg'))

@section('header')
    <div class="container">
        <div class="row">
            <div class="col">
                <article class="pcj-header-content">
                    <h1>Curriculum Vitae</h1>
                    <a href="{{ asset('files/CV-Peter-Christian-Jørgensen-English.pdf') }}" target="_blank" rel="noopener noreferrer" class="btn btn-pcj">
                        Download &nbsp; (English <img src="{{ asset('img/english.png') }}" width="20" class="align-baseline"> )
                    </a>
                    <a href="{{ asset('files/CV-Peter-Christian-Jørgensen-Dansk.pdf') }}" target="_blank" rel="noopener noreferrer" class="btn btn-pcj">
                        Download &nbsp; (Dansk <img src="{{ asset('img/dansk.png') }}" width="20" class="align-baseline"> )
                    </a>
                </article>
            </div>
        </div>
    </div>
@endsection

@section('app')
    <div class="container mb-4">
        <!-- Experience -->
        <div class="row mt-4">
            <div class="col-8">
                <p class="text-muted">Experience</p>
            </div>
            <div class="col-4 text-right">
                <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener">Learn more</a>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card-group">
                    @foreach ($experiences as $experience)
                        <div class="card">
                            <header class="card-header @if ($loop->first) bg-pcj @endif">
                                {{ $experience['date'] }}
                            </header>
                            <section class="card-body">
                                <h3 class="card-title">
                                    {{ $experience['title'] }}
                                    <small class="text-muted">{{ $experience['company'] }}</small>
                                </h3>
                                @foreach ($experience['summary'] as $summary)
                                    <p class="card-text">{!! $summary !!}</p>
                                @endforeach
                            </section>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Education -->
        <div class="row mt-4">
            <div class="col">
                <p class="text-muted">Education</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card-group">
                    @foreach ($educations as $education)
                        <div class="card">
                            <header class="card-header @if ($loop->first) bg-pcj @endif">
                                {{ $education['date'] }}
                            </header>
                            <section class="card-body">
                                <h3 class="card-title">
                                    {{ $education['title'] }}
                                </h3>
                                <p class="card-text">
                                    {{ $education['school'] }}
                                </p>
                            </section>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        <!-- Projects -->
        <div class="row mt-4">
            <div class="col-8">
                <p class="text-muted">Projects</p>
            </div>
            <div class="col-4 text-right">
                <a href="{{ route('portfolio') }}">See all</a>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card-deck mb-4">
                    <div class="card">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/firkant.png') }}"
                                alt="FIRKANT"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
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
                    <div class="card">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/grundfos.png') }}"
                                alt="Grundfos"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
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
                    <div class="card">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/gm48.png') }}"
                                alt="GM48"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset('img/gm48-lowquality.png') }}"
                            data-src="{{ asset('img/gm48.png') }}"
                            alt="GM48"
                        />
                        <section class="card-body">
                            <h2 class="card-title">GM48</h2>
                            <p class="card-text">A games development competition</p>
                        </section>
                        <footer class="card-footer bg-white border-top-0">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </div>
                </div>
            </div>
        </div>

        <!-- Skills -->
        <div class="row mt-4">
            <div class="col">
                <p class="text-muted">Skills</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <ul class="pl-0">
                    <li class="badge badge-pcj badge-lg">Web Design</li>
                    <li class="badge badge-pcj badge-lg">Web Development</li>
                    <li class="badge badge-pcj badge-lg">Bootstrap</li>
                    <li class="badge badge-pcj badge-lg">Laravel</li>
                    <li class="badge badge-pcj badge-lg">Flight</li>
                    <li class="badge badge-pcj badge-lg">MVC</li>
                    <li class="badge badge-pcj badge-lg">Nginx</li>
                    <li class="badge badge-pcj badge-lg">Apache</li>
                    <li class="badge badge-pcj badge-lg">MySQL</li>
                    <li class="badge badge-pcj badge-lg">PHP</li>
                    <li class="badge badge-pcj badge-lg">JQuery</li>
                    <li class="badge badge-pcj badge-lg">AJAX</li>
                    <li class="badge badge-pcj badge-lg">Gulp</li>
                    <li class="badge badge-pcj badge-lg">npm</li>
                    <li class="badge badge-pcj badge-lg">JavaScript</li>
                    <li class="badge badge-pcj badge-lg">CSS</li>
                    <li class="badge badge-pcj badge-lg">SASS</li>
                    <li class="badge badge-pcj badge-lg">HTML</li>
                    <li class="badge badge-pcj badge-lg">SQL</li>
                    <li class="badge badge-pcj badge-lg">SEO</li>
                    <li class="badge badge-pcj badge-lg">REST</li>
                </ul>
                <ul class="pl-0">
                    <li class="badge badge-pcj badge-lg">Game Development</li>
                    <li class="badge badge-pcj badge-lg">Unity3D</li>
                    <li class="badge badge-pcj badge-lg">C#</li>
                    <li class="badge badge-pcj badge-lg">Unreal Engine 4</li>
                    <li class="badge badge-pcj badge-lg">Blueprints Visual Scripting</li>
                    <li class="badge badge-pcj badge-lg">GameMaker: Studio</li>
                    <li class="badge badge-pcj badge-lg">GameMaker Language</li>
                    <li class="badge badge-pcj badge-lg">Java</li>
                    <li class="badge badge-pcj badge-lg">Python</li>
                    <li class="badge badge-pcj badge-lg">Autodesk Maya</li>
                    <li class="badge badge-pcj badge-lg">Autodesk Inventor</li>
                </ul>
                <ul class="pl-0">
                    <li class="badge badge-pcj badge-lg">Microsoft Office</li>
                    <li class="badge badge-pcj badge-lg">Adobe Creative Suite</li>
                    <li class="badge badge-pcj badge-lg">Virtual Reality</li>
                    <li class="badge badge-pcj badge-lg">Community Management</li>
                    <li class="badge badge-pcj badge-lg">Social Marketing</li>
                    <li class="badge badge-pcj badge-lg">Gamification</li>
                    <li class="badge badge-pcj badge-lg">YouTube Partnership</li>
                    <li class="badge badge-pcj badge-lg">SoMe</li>
                    <li class="badge badge-pcj badge-lg">GitHub</li>
                    <li class="badge badge-pcj badge-lg">Git</li>
                    <li class="badge badge-pcj badge-lg">JSON</li>
                    <li class="badge badge-pcj badge-lg">XML</li>
                </ul>
            </div>
        </div>

        <!-- Profile -->
        <div class="row mt-4">
            <div class="col">
                <p class="text-muted">Profile</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <header class="card-header text-center">
                        <img src="{{ asset('img/peter.jpg') }}" class="img-fluid rounded-circle" width="128" style="margin-top: -64px">
                    </header>
                    <div class="card-body">
                        <div class="col p-0 col-lg-10 m-lg-auto col-xl-8 m-xl-auto">
                            <p class="card-text lead">I am a Multimedia Designer from Denmark with a speciality in Film & Animation, and I love to work with web and game development.</p>
                            <p class="card-text">I am inventive and creative with lots of energy and a go-getter attitude. I always work serviceminded, and with quality in focus. I will gladly give it my all if it means that the endproduct is better for it.</p>
                            <p class="card-text">I love to learn new things, and I strive to keep myself up to date with the industry.</p>
                            <p class="card-text">I see my future as an employee, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Other -->
        <div class="row mt-4">
            <div class="col">
                <p class="text-muted">Misc</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <ul class="list-group">
                    <li class="list-group-item">
                        <strong>Nationality</strong>
                        <div>Danish</div>
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
