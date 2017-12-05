@extends('layouts.app')

@section('app')
    <!-- Welcome -->
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
                    <h2 class="h1">Archive</h2>
                    <p>{{ $date }}</p>
                </section>
            </div>
       </div>
    </header>

    <!-- Posts -->
    <div class="container">
        <div class="row my-4">
            <section class="col-lg-8 mr-lg-auto">

                @if($posts->count())
                    <!-- List -->
                    @foreach ($posts as $post)
                        <article class="card mb-4">
                            <section class="card-body">
                                <h1 class="card-title">
                                    <a href="{{ route('post.show', $post->slug) }}" class="card-link">{{ $post->title }}</a>
                                </h1>
                                <h2 class="card-subtitle mb-2 text-muted h6">
                                    {{ $post->published_at->format('F jS, Y') }}
                                </h2>
                                <p class="card-text">
                                    {!! $post->excerpt() !!}
                                </p>
                            </section>
                        </article>
                    @endforeach

                    <!-- Pagination -->
                    {{ $posts->links() }}
                @else
                    <p class="text-danger my-4">There doesn't seem to be anything here.</p>
                @endif

            </section>
        </div>
    </div>
@endsection