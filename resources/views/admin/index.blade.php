@extends('layouts.admin')

@section('admin')
    <!-- Posts -->
    <article class="card">
        <header class="card-header bg-pcj text-white">
            <h1 class="h6 mb-0">Posts</h1>
        </header>
        <div class="table-responsive">
            <table class="table table-striped table-hover mb-0">
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Tags</th>
                        <th class="text-right">Published</th>
                        <th class="text-right">Created</th>
                        <th class="text-right">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($posts as $post)
                        <tr>
                            <td class="align-middle"><a href="{{ route('post.edit', $post->slug) }}" class="btn btn-pcj btn-sm">Edit</a></td>
                            <td class="align-middle"><a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a></td>
                            <td class="align-middle">@foreach ($post->tags as $tag) <span class="badge badge-pcj-orange">{{ $tag->name }}</span> @endforeach</td>
                            <td class="align-middle text-right">@if ($post->published_at) <span data-toggle="tooltip" title="{{ $post->published_at->diffForHumans() }}">{{ $post->published_at->toFormattedDateString() }}</span> @else Draft @endif</td>
                            <td class="align-middle text-right"><span data-toggle="tooltip" title="{{ $post->created_at->diffForHumans() }}">{{ $post->created_at->toFormattedDateString() }}</span></td>
                            <td class="align-middle text-right"><span data-toggle="tooltip" title="{{ $post->updated_at->diffForHumans() }}">{{ $post->updated_at->toFormattedDateString() }}</span></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </article>
@endsection
