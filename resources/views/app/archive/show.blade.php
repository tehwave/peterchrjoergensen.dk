@extends('layouts.app')
@section('title', 'Archive – Peter C. Jørgensen')

@section('header')
    <div class="container">
        <div class="row">
            <div class="col">
                <article class="pcj-header-content">
                    <h1>Archive</h1>
                    <p>{{ $date }}</p>
                </article>
            </div>
        </div>
   </div>
@endsection

@section('app')
    <div class="container">
        <div class="row my-4">
            <div class="col">
                <form action="{{ route('archive.browse') }}" method="POST">
                    {{ csrf_field() }}
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-sm">
                                    <!-- Year -->
                                    <select name="year" class="custom-select d-inline-block mb-2 mb-sm-0 @if ($errors->has('year')) is-invalid @endif">
                                        <option @unless (old('year')) selected @endunless value="">Year</option>
                                        @for ($i = 0; $i < (Carbon\Carbon::now()->year - 2016); $i++)
                                            <option value="{{ Carbon\Carbon::now()->subYears($i)->year }}" @if (old('year') == Carbon\Carbon::now()->subYears($i)->year) selected @endif>{{ Carbon\Carbon::now()->subYears($i)->year }}</option>
                                        @endfor
                                    </select>
                                </div>
                                <div class="col-12 col-sm">
                                    <!-- Month -->
                                    <select name="month" class="custom-select d-inline-block mb-2 mb-sm-0 @if ($errors->has('month')) is-invalid @endif">
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
                                </div>
                                <div class="col-12 col-sm">
                                    <!-- Day -->
                                    <select name="day" class="custom-select d-inline-block mb-2 mb-sm-0 @if ($errors->has('day')) is-invalid @endif">
                                        <option @unless (old('day')) selected @endunless value="">Day</option>
                                        @for ($i = 1; $i < 32; $i++)
                                            <option value="{{ $i }}" @if (old('day') == $i) selected @endif>{{ $i }}</option>
                                        @endfor
                                    </select>
                                </div>
                                <div class="col-12 col-sm text-sm-right">
                                    <!-- Submit -->
                                    <button type="submit" class="btn btn-lg btn-pcj">
                                        Browse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-lg-8 mr-lg-auto">
                @if ($posts->count())
                    <!-- List -->
                    @foreach ($posts as $post)
                        <div class="mb-4">
                            @include('components.post')
                        </div>
                    @endforeach

                    <!-- Pagination -->
                    {{ $posts->links() }}
                @else
                    <p class="text-danger my-4">There doesn't seem to be anything here.</p>
                @endif
            </div>
        </div>
    </div>
@endsection