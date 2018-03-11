<article class="card">
    <noscript>
        <img
            class="card-img-top"
            src="{{ asset(sprintf('img/%s.%s', $project['image'], $project['image_format'])) }}"
            alt="{{ $project['title'] }}"
        />
    </noscript>
    <img
        class="card-img-top lazyload lqip"
        src="{{ asset(sprintf('img/%s-lowquality.%s', $project['image'], $project['image_format'])) }}"
        data-src="{{ asset(sprintf('img/%s.%s', $project['image'], $project['image_format'])) }}"
        alt="{{ $project['title'] }}"
    />
    <section class="card-body">
        <h2 class="card-title">{{ $project['title'] }}</h2>
        <p class="card-text lead">{{ $project['lead'] }}</p>
        <p class="card-text">{{ $project['paragraph'] }}</p>
    </section>
    @isset ($project['link'])
        <footer class="card-footer bg-white border-top-0">
            <a href="{{ $project['link'] }}" target="_blank" rel="noopener" class="card-link">{{ $project['link_text'] }}</a>
        </footer>
    @endisset
</article>