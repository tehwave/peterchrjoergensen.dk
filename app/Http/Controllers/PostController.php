<?php

namespace App\Http\Controllers;

use App\Post;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::published()
            ->latest('published_at')
            ->paginate(5);

        $feeds = collect(config('feed.feeds'))
            ->mapWithKeys(function ($feed, $name) {
                return [$name => $feed['title']];
            });

        return view('app.post.index')
            ->withPosts($posts)
            ->withFeeds($feeds);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        $this->authorize('view', $post);

        if ($post->is_published) {
            $previousPost = Post::published()
                ->where('published_at', '<', $post->published_at)
                ->latest('published_at')
                ->first();

            $nextPost = Post::published()
                ->where('published_at', '>', $post->published_at)
                ->oldest('published_at')
                ->first();
        }

        return view('app.post.show')
            ->withPost($post)
            ->withNextPost($nextPost)
            ->withPreviousPost($previousPost);
    }
}
