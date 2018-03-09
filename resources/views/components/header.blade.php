<header class="pcj-header pcj-parallax"
    data-image-src="{{ isset($image) ? $image : asset('img/header.jpg') }}"
    data-parallax="scroll"
    data-speed="0.6"
    data-z-index="0"
>
    @include('components.navbar')

    {{ $slot }}
</header>
