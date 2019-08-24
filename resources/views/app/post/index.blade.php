@extends('layouts.app')

@section('app')

    <div class="jumbotron mb-0 bg-secondary rounded-0 pattern-waves">
        <div class="container text-white">
            <div class="row my-4 my-xl-6">
                <div class="col-12 col-md-4">
                    <h1>Blog</h1>
                </div>
                <div class="col-12 col-md mt-md-2">
                    <p class="h3">
                        I write about <b>insights</b>, <b>events</b> and <b>resources</b> relevant to the <b>web-</b> and <b>game development</b> communities.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="container mt-4 mt-md-n6">
            <div class="row">
                <div class="col-12 mb-4 col-md-6 col-lg-8">
                    @foreach ($posts as $post)
                        <div class="mb-4">
                            @component('components.post', ['post' => $post]) @endcomponent
                        </div>
                    @endforeach
                    <div>
                        {{ $posts->links() }}
                    </div>
                </div>
                <div class="col-12 mb-4 col-md-6 col-lg-4 ml-lg-auto mb-4">
                    <div class="card shadow-md">
                        <ul class="list-group list-group-flush">
                            @foreach($feeds as $name => $title)
                                <li class="list-group-item mt-4">
                                    <h2 class="h6">Subscribe to my blog</h2>
                                    <svg class="align-middle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16"><g class="nc-icon-wrapper" fill="#e77e2d"><circle fill="#e77e2d" cx="3" cy="13" r="2"></circle> <path fill="#e77e2d" d="M15,15h-2.7C12.3,8.8,7.2,3.7,1,3.7V1C8.7,1,15,7.3,15,15z"></path> <path data-color="color-2" fill="#e77e2d" d="M10.3,15H7.7c0-3.7-3-6.7-6.7-6.7V5.7C6.1,5.7,10.3,9.9,10.3,15z"></path></g></svg>
                                    <a class="card-link" rel="alternate" type="application/rss+xml" href="{{ route("feeds.{$name}") }}" title="{{ $title }}">{{ $title }}</a>
                                </li>
                            @endforeach
                            <li class="list-group-item my-4">
                                <a class="d-block" href="https://www.teamwork.com/partner/1alegq8x6x" target="_blank">
                                    <img class="img-fluid w-100"
                                        alt="Teamwork Projects"
                                        border="0"
                                        src="https://s3.amazonaws.com/tw-referrals/large.png"
                                        srcset="https://s3.amazonaws.com/tw-referrals/large.png 1x, https://s3.amazonaws.com/tw-referrals/large@2x.png 2x"
                                        width="300" height="250"
                                    />
                                </a>
                                <small class="d-block text-muted text-right">Referral</small>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
    </div>
@endsection
