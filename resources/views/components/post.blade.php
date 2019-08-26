<div class="card shadow-md">
    <div class="card-header bg-transparent">
        <h3 class="card-title h4 my-2">
            <a href="{{ $post->url }}">
                {{ $post->title }}
            </a>
        </h3>
    </div>
    <div class="card-body">
        <p class="card-text">
            {!! $post->excerpt !!}
        </p>
    </div>
</div>