<article class="card">
    <section class="card-body">
        <h1 class="card-title h2">
            <a href="{{ route('post.show', $post->slug) }}" class="card-link">{{ $post->title }}</a>
        </h1>
        <p class="card-subtitle text-muted" title="{{ $post->published_at->diffForHumans() }}">
            {{ $post->published_at->format('F jS, Y') }}
        </p>
        <p class="card-text">
            {!! $post->excerpt() !!}
        </p>
    </section>
    <footer class="card-footer bg-white border-top-0">
        @foreach ($post->tags as $tag)
            <span class="badge badge-pcj-orange">
                {{ $tag->name }}
            </span>
        @endforeach
    </footer>
</article>