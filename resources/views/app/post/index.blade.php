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
                    <h2 class="h1">Welcome,</h2>
                    <p> You have found my personal blog, where I talk about the <b>ideas</b>, the <b>insights</b> and the <b>techniques</b> behind my projects.</p>
                    <p>In addition, I post about <b>news</b>, <b>events</b> and <b>resources</b> relevant to the <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23webdev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#webdev</a> & <a href="https://twitter.com/search?f=tweets&vertical=default&q=%23gamedev%20AND%20from%3A%40tehwave" target="_blank" rel="noopener">#gamedev</a> communities.</p>
                </section>
            </div>
       </div>
    </header>

    <!-- Posts -->
    <div class="container">
        <div class="row my-4">
            <section class="col-lg-8">

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

            </section>
            <section class="col-lg-4">

                <!-- Search -->
                <form role="search" method="GET" action="{{ url()->current() }}">
                    <div class="input-group mb-4">
                        <input type="search" class="form-control" name="s" placeholder="..." >
                        <span class="input-group-btn">
                            <input type="submit" class="btn btn-pcj" value="Search">
                        </span>
                    </div>
                </form>

                <!-- Overview -->
                <div class="card">
                    <section class="card-body">

                        {{-- Recent Posts --}}
                        @if (request()->input('page') > 1)
                            <h2 class="card-title h6">
                                Recent
                            </h2>
                            <ul class="list-unstyled">
                                @foreach ($posts->take(3) as $post)
                                    <li><a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a></li>
                                @endforeach
                            </ul>
                        @endif

                        <!-- Archive -->
                        <h2 class="card-title h6">
                            Archive
                            <ul class="list-unstyled">
                                @foreach ($archive as $date => $posts)
                                    <li><a href="{!! route('archive.show', $date) !!}">{{ $date }}</a></li>
                                @endforeach
                            </ul>
                        </h2>
                    </section>
                </div>
            </section>
        </div>
    </div>
@endsection