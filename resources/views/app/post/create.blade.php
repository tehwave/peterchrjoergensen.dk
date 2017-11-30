@extends('layouts.app')
@section('html', 'class=h-100')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                <form method="POST" action="{{ route('post.store') }}">
                    <article class="card my-4">
                        <header class="card-header bg-pcj text-white">
                            <h1 class="h6 mb-0">New</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}

                                @unless ($errors->isEmpty())
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <div class="alert alert-danger" role="alert">
                                                <ul class="list-unstyled mb-0">
                                                    @foreach ($errors->all() as $error)
                                                        <li>{{ $error }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                @endunless

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="name">Title</label>
                                        <input id="title" type="text" class="form-control" name="title" value="{{ old('title') }}" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="excerpt">Excerpt</label>
                                        <textarea id="excerpt" type="text" class="form-control" name="excerpt" value="{{ old('excerpt') }}"></textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="body">Body</label>
                                        <textarea id="body" type="text" class="form-control" rows="10" name="body" value="{{ old('body') }}"></textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="published_at">Publish</label>
                                        <input id="published_at" type="date" class="form-control" name="published_at" value="{{ old('published_at') }}">
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col text-right">
                                    <button type="submit" class="btn btn-pcj">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                </form>
            </div>
        </div>
    </div>
@endsection
