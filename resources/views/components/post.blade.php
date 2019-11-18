<div class="card shadow">
    <div class="card-body">
        <h3 class="card-title h2">
            <a class="text-decoration-none" href="{{ $post->url }}">
                {{ $post->title }}
            </a>
        </h3>
        <p class="card-text">
            <ul class="list-inline mb-0 text-secondary font-medium">
                <li class="list-inline-item">
                    {{ $post->published_at->format('jS F, Y') }}
                </li>
            </ul>
        </p>
        <p class="card-text max-w-sm">
            {!! $post->excerpt !!}
        </p>
    </div>
</div>