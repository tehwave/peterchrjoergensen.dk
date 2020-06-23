<div class="card shadow">
    <div class="card-body">
        <h4 class="card-title h5 mt-2">
            <a href="{{ $post->url }}" class="text-decoration-none">
                {{ $post->title }}
            </a>
        </h4>
        <div class="card-text max-w-sm">
            {!! $post->excerpt_html !!}
        </div>
    </div>
    <div class="card-footer">
        <div class="media">
            <div class="media-body my-auto">
                <small class="d-block">
                    @if ($post->is_published)
                        <time datetime="{{ $post->published_at }}">
                            {{ $post->published_at_formatted }}
                        </time>
                        <span class="mx-1">
                            &middot;
                        </span>
                    @endif
                    <span>
                        {{ $post->reading_time }} min read
                    </span>
                </small>
            </div>
        </div>
    </div>
</div>

