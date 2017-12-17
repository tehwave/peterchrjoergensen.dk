@extends('layouts.admin')

@section('admin')
    <h1>Hello World!</h1>
    <hr>

    <!-- Posts -->
    <h2>Posts</h2>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th></th>
                    <th class="text-right">Published</th>
                    <th class="text-right">Created</th>
                    <th class="text-right">Updated</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($posts as $post)
                    <tr>
                        <td class="align-middle">{{ $post->id }}</td>
                        <td class="align-middle"><a href="{{ route('post.show', $post->slug) }}">{{ $post->title }}</a></td>
                        <td class="align-middle"><a href="{{ route('post.edit', $post->slug) }}" class="btn btn-pcj btn-sm">Edit</a></td>
                        <td class="align-middle text-right">{{ $post->published_at }}</td>
                        <td class="align-middle text-right">{{ $post->created_at }}</td>
                        <td class="align-middle text-right">{{ $post->updated_at }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection

@push('styles')
@endpush

@push('scripts')
@endpush