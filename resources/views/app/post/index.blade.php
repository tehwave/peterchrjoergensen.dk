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
                    @empty (request()->input('query'))
                        <h1>Welcome</h1>
                        <p>You have found my personal blog, where I talk about the <b>ideas</b>, the <b>insights</b> and the <b>techniques</b> behind my projects.</p>
                        <p>In addition, I post about <b>news</b>, <b>events</b> and <b>resources</b> relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> and <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a> communities.</p>
                    @else
                        <h1>Search</h1>
                        <p>{{ $posts->count() }} {{ str_plural('result', $posts->count()) }} for <b> {{ request()->input('query') }}</b></p>
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
                    @if (request()->input('page') > 1 && empty(request()->input('query')))
                        <li class="list-group-item">
                            <div>Recent</div>
                            <ul class="list-unstyled">
                                @foreach (App\Post::published()->orderBy('published_at', 'desc')->take(3)->get() as $post)
                                    <li>
                                        <a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a>
                                        <small class="text-muted">{{ $post->published_at->diffForHumans() }}</small>
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
                        <div>Subscribe</div>
                        <ul class="list-unstyled">
                            @foreach($feeds as $name => $title)
                                <li>
                                    <svg class="align-middle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16"><g class="nc-icon-wrapper" fill="#e77e2d"><circle fill="#e77e2d" cx="3" cy="13" r="2"></circle> <path fill="#e77e2d" d="M15,15h-2.7C12.3,8.8,7.2,3.7,1,3.7V1C8.7,1,15,7.3,15,15z"></path> <path data-color="color-2" fill="#e77e2d" d="M10.3,15H7.7c0-3.7-3-6.7-6.7-6.7V5.7C6.1,5.7,10.3,9.9,10.3,15z"></path></g></svg>
                                    <a rel="alternate" type="application/rss+xml" href="{{ route("feeds.{$name}") }}" title="{{ $title }}">{{ $title }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
@endsection