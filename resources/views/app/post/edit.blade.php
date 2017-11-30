@extends('layouts.app')
@section('html', 'class=h-100')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                {{-- Update --}}
                <form method="POST" action="{{ route('post.update', $post->slug) }}">
                    <article class="card my-4">
                        <header class="card-header bg-pcj text-white">
                            <h1 class="h6 mb-0">Edit</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}
                                {{ method_field('PUT') }}

                                @unless ($errors->update->isEmpty())
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <div class="alert alert-danger" role="alert">
                                                <ul class="list-unstyled mb-0">
                                                    @foreach ($errors->update->all() as $error)
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
                                        <input id="title" type="text" class="form-control" name="title" value="{{ old('title', $post->title) }}" required>

                                    </div>
                                </div>



                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="excerpt">Excerpt</label>
                                        <textarea id="excerpt" type="text" class="form-control" name="excerpt">{{ old('excerpt', $post->excerpt) }}</textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="body">Body</label>
                                        <textarea id="body" type="text" class="form-control" rows="10" name="body">{{ old('body', $post->body) }}</textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="published_at">Publish</label>
                                        <input id="published_at" type="date" class="form-control" name="published_at" value="{{ old('published_at', optional($post->published_at)->toDateString()) }}">
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col text-right">
                                    <button type="submit" class="btn btn-pcj">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                </form>

                {{-- Destroy --}}
                <form method="POST" action="{{ route('post.destroy', $post->slug) }}">
                    <article class="card mb-4">
                        <header class="card-header bg-danger text-white">
                            <h1 class="h6 mb-0">Delete</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}
                                {{ method_field('DELETE') }}

                                @unless ($errors->destroy->isEmpty())
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <div class="alert alert-danger" role="alert">
                                                <ul class="list-unstyled mb-0">
                                                    @foreach ($errors->destroy->all() as $error)
                                                        <li>{{ $error }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                @endunless

                                <div class="form-row">
                                    <div class="form-group col mb-0">
                                        <div class="form-check">
                                            <label class="form-check-label">
                                                <input class="form-check-input" type="checkbox" name="delete" value="1"> I want to delete {{ $post->title }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col text-right">
                                    <button type="submit" class="btn btn-danger">
                                        Destroy
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
