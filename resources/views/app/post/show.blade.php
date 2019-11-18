@extends('layouts.app')
@section('title', "{$post->title} | Peter C. Jørgensen")
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

    <div class="jumbotron mb-0 bg-secondary pattern-waves">
        <div class="container text-white">
            <div class="row my-4 my-xl-6 text-center">
                <div class="col-12">
                    {{-- <div class="text-uppercase h6 text-accent wider">Category</div> --}}
                    <h1 class="display-4 mb-4">{{ $post->title }}</h1>
                    @isset ($post->excerpt)
                        <div class="h3 text-white-50 max-w-md mx-auto">
                            {!! $post->excerpt_html !!}
                        </div>
                    @endisset
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-4 mt-md-n6">
        <div class="row mb-4 mb-xl-6">
            <div class="col">
                <div class="card shadow-md">
                    <div class="card-body">
                        <div class="post-body my-4 my-xl-6">
                            {!! $post->body_html !!}
                            <div class="post-meta">
                                <ul class="list-inline">
                                    <li class="list-inline-item mr-4">
                                        <span class="mr-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 12 12" stroke-width="1"><g stroke-width="1" transform="translate(0, 0)"><path d="M8.5,3C8.5,4.381,7.381,6.5,6,6.5S3.5,4.381,3.5,3a2.5,2.5,0,0,1,5,0Z" fill="none" stroke="#444444" stroke-linecap="round" stroke-linejoin="round" data-color="color-2" stroke-width="1"></path><path d="M2.227,7a5.5,5.5,0,0,0-1.6,2.832,9.488,9.488,0,0,0,10.746,0A5.5,5.5,0,0,0,9.773,7" fill="none" stroke="#444444" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path></g></svg>
                                        </span>
                                        Peter C. Jørgensen
                                    </li>
                                    <li class="list-inline-item">
                                        <span class="mr-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 12 12" stroke-width="1"><g stroke-width="1" transform="translate(0, 0)"><polyline points="6 2.5 6 6 9.5 6" fill="none" stroke="#444444" stroke-linecap="round" stroke-linejoin="round" data-color="color-2" stroke-width="1"></polyline> <circle cx="6" cy="6" r="5.5" fill="none" stroke="#444444" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></circle></g></svg>
                                        </span>
                                        {{ $post->published_at->format('jS F, Y') }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="container-fluid">
                            <div class="row my-2 my-xl-4">
                                <div class="col-12 ml-auto mb-3 col-sm-6 mb-sm-0 col-lg-4">
                                    @isset ($previousPost)
                                        <small class="text-muted font-medium text-uppercase wider">Previous post</small>
                                        <a class="card-link d-block" href="{{ route('post.show', $previousPost->slug) }}">{{ $previousPost->title }}</a>
                                    @endisset
                                </div>
                                <div class="col-12 mr-auto col-sm-6 col-lg-4 text-right">
                                    @isset ($nextPost)
                                        <small class="text-muted font-medium text-uppercase wider">Next post</small>
                                        <a class="card-link d-block" href="{{ route('post.show', $nextPost->slug) }}">{{ $nextPost->title }}</a>
                                    @endisset
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
