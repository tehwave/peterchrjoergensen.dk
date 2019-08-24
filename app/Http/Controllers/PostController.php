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
        abort_if($post->published_at === null && auth()->guest(), 403);

        if ($post->isPublished()) {
            $previousPost = Post::published()
                ->where('published_at', '<', $post->published_at)
                ->latest('published_at')
                ->first();

            $nextPost = Post::published()
                ->where('published_at', '>', $post->published_at)
                ->oldest('published_at')
                ->first();
        }

        // Get page incase from paginated post index
        parse_str(parse_url(url()->previous(), PHP_URL_QUERY), $params);
        $previousPage = $params['page'] ?? null;

        return view('app.post.show')
            ->withPost($post)
            ->withNextPost($nextPost)
            ->withPreviousPost($previousPost)
            ->withPreviousPage($previousPage);
    }
}
