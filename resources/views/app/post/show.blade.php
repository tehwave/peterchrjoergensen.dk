@extends('layouts.app')
@section('title', "$post->title by Peter C. Jørgensen")
@section('description', $post->excerpt)

@section('open-graph')
    <meta property="og:site_name" content="Peter C. Jørgensen">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $post->title }}">
    <meta property="og:updated_time" content="{{ $post->updated_at }}">
    <meta property="og:description" content="{{ $post->excerpt }}">

    <!-- JSON-LD BlogPosting -->
    <script type="application/ld+json">
        {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": "{{ $post->title }}",
            "alternativeHeadline": "{{ $post->excerpt }}",
            @if ($post->tags->count())
                "keywords": "{{ $post->tags->implode('name', ' ') }}",
            @endif
            "wordcount": "{{ str_word_count($post->body) }}",
            "url": "{{ url()->current() }}",
            "datePublished": "{{ $post->published_at }}",
            "dateCreated": "{{ $post->created_at }}",
            "dateModified": "{{ $post->updated_at }}",
            "description": "{{ $post->excerpt }}",
            "articleBody": "{{ $post->body }}",
            "author": {
                "@type": "Person",
                "name": "Peter Christian Jørgensen",
                "jobTitle": "Multimedia Designer",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Kolding",
                    "addressRegion": "Jutland"
                }
            }
        }
    </script>
@endsection

@section('twitter')
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@tehwave">
    <meta name="twitter:creator" content="@tehwave">
    <meta name="twitter:title" content="{{ $post->title }}">
    <meta name="twitter:description" content="{{ $post->excerpt }}">
@endsection

@section('header')
    <div class="container">
        <div class="row">
            <section class="col">
                <article class="pcj-header-content">
                    <h1>
                        {{ $post->title }}
                    </h1>
                    <p>{!! $post->excerpt() !!}</p>
                    <ul class="list-inline mb-0" style="font-size: 1rem">
                        @isset($previous_page)
                            <li class="list-inline-item">
                                <a href="{{ route('post.index', ['page' => $previous_page]) }}" class="align-middle">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16"><g class="nc-icon-wrapper" fill="#ffffff"><path fill="#ffffff" d="M8,5c5.2,0,8,3.8,8,10c-1.5-2.4-2.7-4-8-4v4L0,8l8-7V5z"></path></g></svg>
                                </a>
                            </li>
                        @else
                            <li class="list-inline-item">
                                <a href="{{ route('post.index') }}" class="align-middle">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16"><g class="nc-icon-wrapper" fill="#ffffff"><path fill="#ffffff" d="M8,5c5.2,0,8,3.8,8,10c-1.5-2.4-2.7-4-8-4v4L0,8l8-7V5z"></path></g></svg>
                                </a>
                            </li>
                        @endisset
                        @isset($post->published_at)
                            <li class="list-inline-item" data-toggle="tooltip" data-placement="top" title="{{ $post->published_at->diffForHumans() }}">
                                {{ $post->published_at->format('F jS, Y') }}
                            </li>
                        @else
                            <li class="list-inline-item">Draft</li>
                        @endisset
                        @foreach ($post->tags as $tag)
                            <li class="list-inline-item">#{{ $tag->name }}</li>
                        @endforeach
                    </ul>
                </article>
            </section>
        </div>
   </div>
@endsection

@section('app')
    <div class="container">

        <!-- Body -->
        <div class="row my-4">
            <div class="col">
                <article class="pcj-post-body">
                    {!! $post->body() !!}
                </article>
            </div>
        </div>

        <!-- Meta -->
        <div class="row text-center">
            <div class="col">
                <div class="card pcj-post-footer">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 mb-3 col-sm-6 mb-sm-0 order-2 col-md-3 order-md-1 my-md-auto col-lg-4">
                                @isset ($previous_post)
                                    <small>Previous</small>
                                    <a class="d-block" href="{{ route('post.show', $previous_post->slug) }}">{{ $previous_post->title }}</a>
                                @endisset
                            </div>
                            <div class="col-12 order-1 mb-4 col-md-6 order-md-2 my-md-auto col-lg-4 text-center">
                                <noscript>
                                    <img
                                        class="img-fluid rounded-circle pcj-post-avatar"
                                        src="{{ asset('img/peter.jpg') }}"
                                        width="128"
                                    />
                                </noscript>
                                <img
                                    class="lazyload lqip img-fluid rounded-circle pcj-post-avatar"
                                    src="{{ asset('img/peter-lowquality.jpg') }}"
                                    data-src="{{ asset('img/peter.jpg') }}"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Peter C. Jørgensen"
                                    width="128"
                                />
                            </div>
                            <div class="col-12 col-sm-6 order-3 col-md-3 order-md-3 my-md-auto col-lg-4">
                                @isset ($next_post)
                                    <small>Next</small>
                                    <a class="d-block" href="{{ route('post.show', $next_post->slug) }}">{{ $next_post->title }}</a>
                                @endisset
                            </div>
                        </div>
                    </div>
                    @auth
                        <footer class="card-footer">
                            <div class="row">
                                <div class="col col-lg-4 mx-lg-auto">
                                    <a href="{{ route('admin.index') }}" class="btn btn-block btn-outline-pcj mb-2 mb-lg-0">Admin</a>
                                </div>
                                <div class="col col-lg-4 mx-lg-auto">
                                    <a href="{{ route('post.edit', $post->slug) }}" class="btn btn-block btn-pcj">Edit</a>
                                </div>
                            </div>
                        </footer>
                    @endauth
                </div>
            </div>
        </div>
    </div>
@endsection