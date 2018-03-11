@extends('layouts.app')
@section('title', 'Blog – Peter C. Jørgensen')
@section('banner', asset('img/blog.jpg'))

@push('head')
    @include('feed::links')
@endpush

@section('header')
    <div class="container">
        <div class="row">
            <section class="col">
                <article class="pcj-header-content mb-0">
                    @empty (request()->input('q'))
                        <h2 class="h1">Welcome</h2>
                        <p>You have found my personal blog, where I talk about the <b>ideas</b>, the <b>insights</b> and the <b>techniques</b> behind my projects.</p>
                        <p>In addition, I post about <b>news</b>, <b>events</b> and <b>resources</b> relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> and <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a> communities.</p>
                    @else
                        <h2 class="h1">Search</h2>
                        <p>{{ $posts->count() }} {{ str_plural('result', $posts->count()) }} for <b> {{ request()->input('q') }}</b></p>
                    @endempty
                </article>
            </section>
        </div>
   </div>
@endsection

@section('app')
    <!-- Posts -->
    <div class="container">
        <div class="row my-4">
            <section class="col-lg-8">

                <!-- Search -->
                <div class="mb-4 d-block d-lg-none">
                    @include('components.search')
                </div>

                <!-- List -->
                @if ($posts->count())
                    @foreach ($posts as $post)
                        <div class="mb-4">
                            @include('components.post')
                        </div>
                    @endforeach
                @else
                    <p class="text-danger my-1">There doesn't seem to be anything here.</p>
                @endif

                <!-- Pagination -->
                {{ $posts->links() }}

            </section>
            <section class="col-lg-4">

                <!-- Search -->
                <div class="mb-4 d-none d-lg-block">
                    @include('components.search')
                </div>

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