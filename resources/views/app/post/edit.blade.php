@extends('layouts.app')
@section('html', 'class=h-100')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container-fluid h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                {{-- Update --}}
                <form method="POST" action="{{ route('post.update', $post->slug) }}">
                    <article class="card my-4">
                        <header class="card-header bg-pcj text-white">
                            <div class="row">
                                <section class="col-lg-8 mx-lg-auto">
                                    <h1 class="h6 mb-0">Edit</h1>
                                    <h2 class="mb-0">{{ $post->title }}</h2>
                                </section>
                            </div>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}
                                {{ method_field('PUT') }}

                                @unless ($errors->update->isEmpty())
                                    <div class="form-row">
                                        <div class="form-group col-lg-8 mx-lg-auto">
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
                                    <div class="form-group col-lg-8 mx-lg-auto">
                                        <label for="name">Title</label>
                                        <input id="title" type="text" class="form-control" name="title" value="{{ old('title', $post->title) }}" required>
                                    </div>
                                </div>



                                <div class="form-row">
                                    <div class="form-group col-lg-8 mx-lg-auto">
                                        <label for="excerpt">Excerpt</label>
                                        <textarea id="excerpt" type="text" class="form-control" name="excerpt">{{ old('excerpt', $post->excerpt) }}</textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-lg-8 mx-lg-auto">
                                        <label for="body">Body</label>
                                        <textarea id="body" type="text" class="form-control" rows="10" name="body">{{ old('body', $post->body) }}</textarea>
                                        <ul class="list-inline form-text text-muted mb-0">
                                            <li class="list-inline-item">Markdown</li>
                                            <li class="list-inline-item">HTML</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-lg-8 mx-lg-auto">
                                        <label for="published_at">Publish</label>
                                        <input id="published_at" type="date" class="form-control" name="published_at" value="{{ old('published_at', optional($post->published_at)->toDateString()) }}">
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col-lg-8 mx-lg-auto text-right">
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
                                    <div class="form-group col-lg-8 mx-lg-auto mb-0">
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
                                <div class="col-lg-8 mx-lg-auto text-right">
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

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
    <script type="text/javascript">
        var simplemde = new SimpleMDE({
            element: $("#body")[0],
            insertTexts: {
                image: ['<img src="', '">'],
            },
            autosave: {
                enabled: true,
                uniqueId: "post{{ $post->id }}",
                delay: 1000,
            },
            spellChecker: false,
        });
    </script>
@endpush