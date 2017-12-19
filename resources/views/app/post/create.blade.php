@extends('layouts.admin')

@section('admin')
    <form method="POST" action="{{ route('post.store') }}">
        <article class="card">
            <header class="card-header bg-pcj text-white">
                <div class="row">
                    <section class="col-lg-8 mx-lg-auto">
                        <h1 class="h6 mb-0">New</h1>
                    </section>
                </div>
            </header>
            <section class="card-body">
                    {{ csrf_field() }}

                    @unless ($errors->isEmpty())
                        <div class="form-row">
                            <div class="form-group  col-lg-8 mx-lg-auto">
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
                        <div class="form-group  col-lg-8 mx-lg-auto">
                            <label for="title">Title</label>
                            <input id="title" type="text" class="form-control" name="title" value="{{ old('title') }}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-lg-8 mx-lg-auto">
                            <label for="tags">Tags</label>
                            <input id="tags" type="text" class="form-control" name="tags" value="{{ old('tags') }}">
                            <ul class="list-inline form-text text-muted mb-0">
                                <li class="list-inline-item">Seperate tags with commas</li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group  col-lg-8 mx-lg-auto">
                            <label for="excerpt">Excerpt</label>
                            <textarea id="excerpt" type="text" class="form-control" name="excerpt" value="{{ old('excerpt') }}"></textarea>
                            <ul class="list-inline form-text text-muted mb-0">
                                <li class="list-inline-item">Markdown</li>
                            </ul>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group  col-lg-8 mx-lg-auto">
                            <label for="body">Body</label>
                            <textarea id="body" type="text" class="form-control" rows="10" name="body" value="{{ old('body') }}"></textarea>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group  col-lg-8 mx-lg-auto">
                            <label for="published_at">Publish</label>
                            <input id="published_at" type="date" class="form-control" name="published_at" value="{{ old('published_at') }}">
                        </div>
                    </div>
            </section>
            <footer class="card-footer">
                <div class="form-row">
                    <div class=" col-lg-8 mx-lg-auto text-right">
                        <button type="submit" class="btn btn-pcj">
                            Create
                        </button>
                    </div>
                </div>
            </footer>
        </article>
    </form>
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
                delay: 1000,
            },
            spellChecker: false,
        });
    </script>
@endpush