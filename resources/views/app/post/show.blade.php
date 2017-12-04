@extends('layouts.app')

@section('app')
    <header
        class="pcj-parallax pcj-header pcj-blog-header"
        data-image-src="{{ asset('img/blog.jpg') }}"
        data-natural-height="1277"
        data-natural-width="1920"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">{{ $post->title }}</h2>
                    <p>{{ $post->excerpt }}</p>
                </section>
            </div>
       </div>
    </header>

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
                                <section class="col-lg-4 mx-lg-auto">
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