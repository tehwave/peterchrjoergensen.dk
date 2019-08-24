@extends('layouts.app')
@section('title', $post->title)
@section('description', $post->excerpt)

@section('open-graph')
    <meta property="og:site_name" content="Peter C. Jørgensen">
    <meta property="og:url" content="{{ $post->url }}">
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
            "url": "{{ $post->url }}",
            "datePublished": "{{ $post->published_at }}",
            "dateCreated": "{{ $post->created_at }}",
            "dateModified": "{{ $post->updated_at }}",
            "description": "{{ $post->excerpt }}",
            "articleBody": "{{ $post->body }}",
            "author": {
                "@type": "Person",
                "name": "Peter Christian Jørgensen",
                "jobTitle": "Web Developer",
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
@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">

    </div>

    <div class="container mt-4 mt-md-n6">
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <div class="card shadow-md">
                    <div class="card-header text-center bg-transparent">
                        <h1 class="card-title my-4 my-xl-6">
                            {{ $post->title }}
                        </h1>
                    </div>
                    <div class="card-body">
                        <div class="post-body">
                            {!! $post->body_html !!}
                        </div>
                        <div class="post-author">
                            <small>Written by</small>
                            <div class="h4">Peter C. Jørgensen</div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-12 mb-3 col-sm-6 mb-sm-0 order-2 col-md-3 order-md-1 my-md-auto col-lg-4">
                                @isset ($previousPost)
                                    <small>Previous</small>
                                    <a class="d-block" href="{{ route('post.show', $previousPost->slug) }}">{{ $previousPost->title }}</a>
                                @endisset
                            </div>
                            <div class="col-12 order-1 mb-4 col-md-6 order-md-2 my-md-auto col-lg-4 text-center">
                                <noscript>
                                    <img
                                        class="img-fluid rounded-circle shadow-lg"
                                        src="{{ asset('img/Peter.png') }}"
                                        width="128"
                                    />
                                </noscript>
                                <img
                                    class="img-fluid rounded-circle shadow-lg"
                                    data-lazy
                                    src="{{ asset('img/Peter_thumbnail.png') }}"
                                    data-src="{{ asset('img/Peter.png') }}"
                                    width="128"
                                />
                            </div>
                            <div class="col-12 col-sm-6 order-3 col-md-3 order-md-3 my-md-auto col-lg-4">
                                @isset ($nextPost)
                                    <small>Next</small>
                                    <a class="d-block" href="{{ route('post.show', $nextPost->slug) }}">{{ $nextPost->title }}</a>
                                @endisset
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
