<?php

namespace App\Http\Controllers;

use App\Post;
use Validator;
use Spatie\Tags\Tag;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (request()->has('query')) {
            $posts = Post::search(request()->input('query'))->paginate(5);
        } else {
            $posts = Post::published()->orderBy('published_at', 'desc')->paginate(5);
        }

        $archive = Post::published()->get()->sortByDesc('published_at')->groupBy(function ($post) {
            return $post->published_at->format('Y/m');
        });

        $feeds = collect(config('feed.feeds'))->mapWithKeys(function ($feed, $name) {
            return [$name => $feed['title']];
        });

        return view('app.post.index', compact('posts', 'archive', 'feeds'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        // Get page incase from paginated post index
        parse_str(parse_url(url()->previous(), PHP_URL_QUERY), $params);
        $previous_page = $params['page'] ?? null;

        abort_if($post === null, 404);
        abort_if($post->published_at === null && auth()->guest(), 403);

        if ($post->published_at !== null) {
            $previous_post = Post::published()
                ->where('published_at', '<', $post->published_at)
                ->orderBy('published_at', 'desc')
                ->first();

            $next_post = Post::published()
                ->where('published_at', '>', $post->published_at)
                ->orderBy('published_at', 'asc')
                ->first();
        }

        return view('app.post.show', compact('post', 'previous_post', 'next_post', 'previous_page'));
    }
}
