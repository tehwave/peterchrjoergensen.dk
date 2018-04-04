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
                        <h1>Welcome</h1>
                        <p>You have found my personal blog, where I talk about the <b>ideas</b>, the <b>insights</b> and the <b>techniques</b> behind my projects.</p>
                        <p>In addition, I post about <b>news</b>, <b>events</b> and <b>resources</b> relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> and <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a> communities.</p>
                    @else
                        <h1>Search</h1>
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
            <div class="col-lg-8">

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
                <div class="mb-4">
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-format="fluid"
                         data-ad-layout-key="-5i+e7+5o-6q-71"
                         data-ad-client="ca-pub-4880846761046037"
                         data-ad-slot="4955556552"></ins>
                </div>

                <!-- Pagination -->
                {{ $posts->links() }}

            </div>
            <div class="col-lg-4">

                <!-- Search -->
                <div class="mb-4 d-none d-lg-block">
                    @include('components.search')
                </div>

                <!-- Overview -->
                <ul class="list-group">
                    {{-- Recent Posts --}}
                    @if (request()->input('page') > 1)
                        <li class="list-group-item">
                            <div>Recent</div>
                            <ul class="list-unstyled">
                                @foreach ($posts->take(3) as $post)
                                    <li>
                                        <a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a>
                                        <span class="text-muted">{{ $post->published_at->diffForHumans() }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        </li>
                    @endif
                    <!-- Archive -->
                    <li class="list-group-item">
                        <div>Archive</div>
                        <ul class="list-unstyled">
                            @foreach ($archive as $date => $posts)
                                <li><a href="{!! route('archive.show', $date) !!}">{{ $date }}</a></li>
                            @endforeach
                        </ul>
                    </li>
                    <!-- Feeds -->
                    <li class="list-group-item">
                        <div>RSS Feed</div>
                        <ul class="list-unstyled">
                            @foreach($feeds as $name => $title)
                                <li><a rel="alternate" type="application/rss+xml" href="{{ route("feeds.{$name}") }}" title="{{ $title }}">{{ $title }}</a></li>
                            @endforeach
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection