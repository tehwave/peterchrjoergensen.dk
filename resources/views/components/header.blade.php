<header class="pcj-header pcj-parallax"
    data-image-src="@yield('banner', asset('img/header.jpg'))"
    data-parallax="scroll"
    data-speed="0.6"
    data-z-index="0"
    style="padding: 6rem 0; background-color: #298cab"
>
    @include('components.navbar')

    {{ $slot }}
</header>
