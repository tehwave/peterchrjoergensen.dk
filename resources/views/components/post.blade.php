<div class="card shadow-md">
    <div class="card-body">
        <h3 class="card-title h2">
            <a class="text-decoration-none" href="{{ $post->url }}">
                {{ $post->title }}
            </a>
        </h3>
        <p class="card-text">
            <ul class="list-inline mb-0 text-muted">
                <li class="list-inline-item">
                    {{ $post->published_at->format('jS F, Y') }}
                </li>
            </ul>
        </p>
        <p class="card-text text-muted max-w-sm font-medium">
            {!! $post->excerpt !!}
        </p>
    </div>
</div>