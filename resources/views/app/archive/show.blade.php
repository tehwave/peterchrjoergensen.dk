@extends('layouts.app')

@section('app')
    <!-- Welcome -->
    <header
        class="pcj-parallax pcj-header pcj-blog-header"
        data-image-src="{{ asset('img/blog.jpg') }}"
        data-natural-height="1277"
        data-natural-width="1920"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row">
                <section class="col">
                    <h2 class="h1">Archive</h2>
                    <p>{{ $date }}</p>
                </section>
            </div>
       </div>
    </header>

    <!-- Posts -->
    <div class="container">
        <div class="row my-4">
            <section class="col-lg-8 mr-lg-auto">
                <form action="{{ route('archive.browse') }}" method="POST">
                    {{ csrf_field() }}
                    <div class="card">
                        <section class="card-body">
                            <div class="row">
                                <section class="col-12 col-sm">
                                    <!-- Year -->
                                    <select name="year" class="custom-select mb-2 mb-sm-0 @if ($errors->has('year')) is-invalid @endif">
                                        <option @unless (old('year')) selected @endunless value="">Year</option>
                                        @for ($i = 0; $i < (Carbon\Carbon::now()->year - 2016); $i++)
                                            <option value="{{ Carbon\Carbon::now()->subYears($i)->year }}" @if (old('year') == Carbon\Carbon::now()->subYears($i)->year) selected @endif>{{ Carbon\Carbon::now()->subYears($i)->year }}</option>
                                        @endfor
                                    </select>
                                    <!-- Month -->
                                    <select name="month" class="custom-select mb-2 mb-sm-0 @if ($errors->has('month')) is-invalid @endif">
                                        <option @unless (old('month')) selected @endunless value="">Month</option>
                                        <option value="1" @if (old('month') == 1) selected @endif>January</option>
                                        <option value="2" @if (old('month') == 2) selected @endif>February</option>
                                        <option value="3" @if (old('month') == 3) selected @endif>March</option>
                                        <option value="4" @if (old('month') == 4) selected @endif>April</option>
                                        <option value="5" @if (old('month') == 5) selected @endif>May</option>
                                        <option value="6" @if (old('month') == 6) selected @endif>June</option>
                                        <option value="7" @if (old('month') == 7) selected @endif>July</option>
                                        <option value="8" @if (old('month') == 8) selected @endif>August</option>
                                        <option value="9" @if (old('month') == 9) selected @endif>September</option>
                                        <option value="10" @if (old('month') == 10) selected @endif>October</option>
                                        <option value="11" @if (old('month') == 11) selected @endif>November</option>
                                        <option value="12" @if (old('month') == 12) selected @endif>December</option>
                                    </select>
                                    <!-- Day -->
                                    <select name="day" class="custom-select mb-2 mb-sm-0 @if ($errors->has('day')) is-invalid @endif">
                                        <option @unless (old('day')) selected @endunless value="">Day</option>
                                        @for ($i = 1; $i < 32; $i++)
                                            <option value="{{ $i }}" @if (old('day') == $i) selected @endif>{{ $i }}</option>
                                        @endfor
                                    </select>
                                </section>
                                <section class="col-12 col-sm-4 text-sm-right">
                                    <!-- Submit -->
                                    <button type="submit" class="btn btn-pcj">
                                        Browse
                                    </button>
                                </section>
                            </div>
                        </section>
                    </div>
                </form>
            </section>
        </div>
        <div class="row mb-4">
            <section class="col-lg-8 mr-lg-auto">

                @if($posts->count())
                    <!-- List -->
                    @foreach ($posts as $post)
                        <article class="card mb-4">
                            <section class="card-body">
                                <h1 class="card-title">
                                    <a href="{{ route('post.show', $post->slug) }}" class="card-link">{{ $post->title }}</a>
                                </h1>
                                <h2 class="card-subtitle mb-2 text-muted h6">
                                    {{ $post->published_at->format('F jS, Y') }}
                                </h2>
                                <p class="card-text">
                                    {!! $post->excerpt() !!}
                                </p>
                            </section>
                        </article>
                    @endforeach

                    <!-- Pagination -->
                    {{ $posts->links() }}
                @else
                    <p class="text-danger my-4">There doesn't seem to be anything here.</p>
                @endif

            </section>
        </div>
    </div>
@endsection