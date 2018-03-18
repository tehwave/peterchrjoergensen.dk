@extends('layouts.app')
@section('title', $post->title)
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
                    <h2 class="h1">
                        <span style="color: #E77E2D">|</span>
                        {{ $post->title }}
                    </h2>
                    <p>{!! $post->excerpt() !!}</p>
                </article>
            </section>
        </div>
   </div>
@endsection

@section('app')
    <div class="container">
        <!-- Meta -->
        <div class="row my-4 text-center">
            <section class="col">
                <div class="card">
                    <section class="card-body">
                        <div class="row">
                            <section class="col-12 mb-3 col-sm-6 mb-sm-0 order-2 col-md-3 order-md-1">
                                @isset ($previous_post)
                                    <small>Previous</small>
                                    <div><a href="{{ route('post.show', $previous_post->slug) }}">{{ $previous_post->title }}</a></div>
                                @endisset
                            </section>
                            <section class="col-12 order-1 mb-4 col-md-6 order-md-2 my-md-auto">
                                <div>
                                    @isset($post->published_at)
                                        {{ $post->published_at->format('F jS, Y') }}
                                    @else
                                        Draft
                                    @endisset
                                </div>
                                @if ($post->tags->count())
                                    <div>
                                        @foreach ($post->tags as $tag)
                                            <span class="pcj-tag">{{ $tag->name }}</span>
                                        @endforeach
                                    </div>
                                @endif
                            </section>
                            <section class="col-12 col-sm-6 order-3 col-md-3 order-md-3">
                                @isset ($next_post)
                                    <small>Next</small>
                                    <div><a href="{{ route('post.show', $next_post->slug) }}">{{ $next_post->title }}</a></div>
                                @endisset
                            </section>
                        </div>
                    </section>
                    @auth
                        <footer class="card-footer">
                            <div class="row">
                                <section class="col-lg-4">
                                    <a href="{{ route('admin.index') }}" class="btn btn-block btn-outline-pcj mb-2 mb-lg-0">Admin</a>
                                </section>
                                <section class="col-lg-4 mr-lg-auto">
                                    <a href="{{ route('post.edit', $post->slug) }}" class="btn btn-block btn-pcj">Edit</a>
                                </section>
                            </div>
                        </footer>
                    @endauth
                </div>
            </section>
        </div>

        <!-- Body -->
        <div class="row mb-4">
            <section class="col">
                <article class="pcj-post-body">
                    {!! $post->body() !!}
                </article>
            </section>
        </div>

    </div>
@endsection