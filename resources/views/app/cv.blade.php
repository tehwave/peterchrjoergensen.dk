@extends('layouts.app')
@section('title', 'Curriculum Vitae – Peter C. Jørgensen')

@section('app')
    <!-- Introduction -->
    <section class="pcj-parallax pcj-header mb-5"
        data-parallax="scroll"
        data-speed="0.6"
        data-image-src="{{ asset('img/cv.jpg') }}"
        data-natural-width="1920"
        data-natural-height="1277"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Curriculum Vitae</h2>
                    <a href="{{ asset('files/CV-Peter-Christian-Jørgensen-English.pdf') }}" target="_blank" rel="noopener noreferrer" class="btn btn-pcj">
                        Download &nbsp; (English <img src="{{ asset('img/english.png') }}" width="20" class="align-baseline"> )
                    </a>
                    <a href="{{ asset('files/CV-Peter-Christian-Jørgensen-Dansk.pdf') }}" target="_blank" rel="noopener noreferrer" class="btn btn-pcj">
                        Download &nbsp; (Dansk <img src="{{ asset('img/dansk.png') }}" width="20" class="align-baseline"> )
                    </a>
                </section>
            </div>
        </div>
    </section>

    <!-- Education -->
    <div class="container mb-5">
        <div class="row mt-4">
            <section class="col-12">
                <h3 class="h2">Education</h3>
                <hr>
            </section>
        </div>
        @foreach ($educations as $education)
            <div class="row mb-4">
                <section class="col-12 col-lg-2">
                    {{ $education['date'] }}
                </section>
                <section class="col-12 col-lg-8">
                    <h3>
                        {{ $education['title'] }}
                        <small class="d-block d-lg-inline-block">{{ $education['school'] }}</small>
                    </h3>
                </section>
            </div>
        @endforeach
    </div>

    <!-- Experience -->
    <div class="container mb-5">
        <div class="row mt-4">
            <section class="col-12">
                <h3 class="h2">Experience</h3>
                <hr>
            </section>
        </div>
        @foreach ($experiences as $experience)
            <div class="row mb-4">
                <section class="col-12 col-lg-2">
                    {{ $experience['date'] }}
                </section>
                <section class="col-12 col-lg-8">
                    <h3>
                        {{ $experience['title'] }}
                        <small class="d-block d-lg-inline-block">{{ $experience['company'] }}</small>
                    </h3>
                    @foreach ($experience['summary'] as $summary)
                        <p>{!! $summary !!}</p>
                    @endforeach
                </section>
            </div>
        @endforeach
        <div class="row mt-3">
            <section class="col text-center">
                <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" rel="noopener" class="btn btn-outline-pcj">Learn more</a>
            </section>
        </div>
    </div>


    <!-- Projects -->
    <div class="container">
        <div class="row">
            <section class="col">
                <h3 class="h2">Projects</h3>
                <hr>
            </section>
        </div>
    </div>
    <div class="container-fluid mb-5">
       <div class="row">
            <section class="col-12 mx-auto col-lg-12 col-xl-10">
                <div class="card-deck">
                    <article class="card mb-4">
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
                        <footer class="card-footer">
                            <a href="/FIRKANT" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card mb-4">
                        <noscript>
                            <img
                                class="card-img-top"
                                src="{{ asset('img/b2bkolding.png') }}"
                                alt="B2B Kolding"
                            />
                        </noscript>
                        <img
                            class="card-img-top lazyload lqip"
                            src="{{ asset('img/b2bkolding-lowquality.png') }}"
                            data-src="{{ asset('img/b2bkolding.png') }}"
                            alt="B2B Kolding"
                        />
                        <section class="card-body">
                            <h2 class="card-title">B2B Kolding</h2>
                            <p class="card-text">A custom Wordpress website for a local trade fair</p>
                        </section>
                        <footer class="card-footer">
                            <a href="https://www.b2bkolding.dk" target="_blank" rel="noopener" class="card-link">Website</a>
                        </footer>
                    </article>
                    <article class="card mb-4">
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
                        <footer class="card-footer">
                            <a href="http://www.gm48.net/" target="_blank" rel="noopener" class="card-link">Website</a>
                            <a href="https://blog.peterchrjoergensen.dk/category/gm48/" target="_blank" rel="noopener" class="card-link">Blog</a>
                        </footer>
                    </article>
                </div>
            </section>
        </div>
        <div class="row mt-3">
            <section class="col text-center">
                <a href="{{ route('portfolio') }}" target="_blank" rel="noopener" class="btn btn-outline-pcj">Browse my portfolio</a>
            </section>
        </div>
    </div>

    <!-- Skills -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Skills</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col">
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
            </section>
        </div>
    </div>

    <!-- Profile -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Profile</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="d-none d-lg-block col-lg-2">
                    <img src="{{ asset('img/peter.jpg') }}" class="img-fluid rounded-circle">
            </section>
            <section class="col-12 col-lg-8">
                <p class="lead">I am a Multimedia Designer from Denmark with a speciality in Film & Animation, and I love to work with web and game development.</p>
                <p>I am inventive and creative with lots of energy and a go-getter attitude. I always work serviceminded, and with quality in focus. I will gladly give it my all if it means that the endproduct is better for it.</p>
                <p>I love to learn new things, and I strive to keep myself up to date with the industry.</p>
                <p>I see my future as an employee, who is respected by my co-workers for my knowledge, skill and sharp senses as well as cheerfulness.</p>
            </section>
        </div>
    </div>

    <!-- Other -->
    <div class="container mb-5">
        <div class="row">
            <section class="col">
                <h3 class="h2">Other</h3>
                <hr>
            </section>
        </div>
        <div class="row">
            <section class="col-12 col-lg-2">
                <strong>Nationality</strong>
            </section>
            <section class="col-12 col-lg-8">
                <p>Danish</p>
            </section>
        </div>
        <div class="row">
            <section class="col-12 col-lg-2">
                <strong>Driver's License</strong>
            </section>
            <section class="col-12 col-lg-8">
                <p>Type B</p>
            </section>
        </div>
    </div>
@endsection