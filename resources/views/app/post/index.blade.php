@extends('layouts.app')

@push('head')
    @include('feed::links')
@endpush

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
                    @empty (request()->input('q'))
                        <h2 class="h1">Welcome,</h2>
                        <p>You have found my personal blog, where I talk about the <b>ideas</b>, the <b>insights</b> and the <b>techniques</b> behind my projects.</p>
                        <p>In addition, I post about <b>news</b>, <b>events</b> and <b>resources</b> relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a> communities.</p>
                    @else
                        <h2 class="h1">Search</h2>
                        <p>{{ $posts->count() }} {{ str_plural('result', $posts->count()) }} for <b> {{ request()->input('q') }}</b></p>
                    @endempty
                </section>
            </div>
       </div>
    </header>

    <!-- Posts -->
    <div class="container">
        <div class="row my-4">
            <section class="col-lg-8">

                <!-- List -->
                @if ($posts->count())
                    @foreach ($posts as $post)
                        <article class="card mb-4">
                            <section class="card-body">
                                <h1 class="card-title h2">
                                    <a href="{{ route('post.show', $post->slug) }}" class="card-link">{{ $post->title }}</a>
                                </h1>
                                <h2 class="card-subtitle mb-2 text-muted h6">
                                    {{ $post->published_at->format('F jS, Y') }}
                                </h2>
                                @foreach ($post->tags as $tag)
                                    <span class="badge badge-pill badge-pcj">{{ $tag->name }}</span>
                                @endforeach
                                <p class="card-text">
                                    {!! $post->excerpt() !!}
                                </p>
                            </section>
                        </article>
                    @endforeach
                @else
                    <p class="text-danger my-1">There doesn't seem to be anything here.</p>
                @endif

                <!-- Pagination -->
                {{ $posts->links() }}

            </section>
            <section class="col-lg-4">

                <!-- Search -->
                <form role="search" method="GET" action="{{ url()->current() }}">
                    <div class="input-group mb-4">
                        <input type="search" class="form-control" name="q" placeholder="..." value="{{ request()->input('q') }}">
                        <span class="input-group-append">
                            <button type="submit" class="btn btn-pcj">Search</button>
                        </span>
                    </div>
                </form>

                <!-- Overview -->
                <div class="card">
                    <section class="card-body">

                        {{-- Recent Posts --}}
                        @if (request()->input('page') > 1)
                            <h2 class="h6 mb-0">
                                Recent
                            </h2>
                            <img src="{{ asset('img/orange-line.svg') }}">
                            <ul class="list-unstyled">
                                @foreach ($posts->take(3) as $post)
                                    <li>
                                        <a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a>
                                        <span class="text-muted">{{ $post->published_at->diffForHumans() }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        @endif

                        <!-- Archive -->
                        <h2 class="h6 @if (request()->input('page') > 1) mt-5 @endif mb-0">
                            Archive
                        </h2>
                        <img src="{{ asset('img/orange-line.svg') }}">
                        <ul class="list-unstyled">
                            @foreach ($archive as $date => $posts)
                                <li><a href="{!! route('archive.show', $date) !!}">{{ $date }}</a></li>
                            @endforeach
                        </ul>

                        <!-- Feeds -->
                        <h2 class="h6 mt-5 mb-0">
                            RSS Feed
                        </h2>
                        <img src="{{ asset('img/orange-line.svg') }}">
                        <ul class="list-unstyled mb-0">
                            @foreach($feeds as $name => $title)
                                <li><a rel="alternate" type="application/rss+xml" href="{{ route("feeds.{$name}") }}" title="{{ $title }}">{{ $title }}</a></li>
                            @endforeach
                        </ul>
                    </section>
                </div>
            </section>
        </div>
    </div>
@endsection