<div class="card shadow-md overflow-hidden">
    <img
        class="card-img-top"
        data-lazy
        src="{{ $project->logo_thumbnail }}"
        data-src="{{ $project->logo }}"
        alt="{{ $project->title }}"
    />
    <div class="card-body">
        <h4 class="card-title">{{ $project->title }}</h4>
        <p class="card-text">{{ $project->summary }}</p>
    </div>
    @if ($project->hasLinks())
        <div class="card-footer bg-white border-top-0">
            @foreach ($project->links as $linkText => $linkUrl)
                <a href="{{ $linkUrl }}" target="_blank" rel="noopener" class="card-link">
                    {{ $linkText }}
                </a>
            @endforeach
        </div>
    @endif
</div>