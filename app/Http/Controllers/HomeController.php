<?php

namespace App\Http\Controllers;

use Cache;
use App\Post;

class HomeController extends Controller
{
    /**
     * Retrieve posts and stay home.
     *
     * @return \Illuminate\Http\Response
     */
    public function __invoke()
    {
        $posts = Cache::remember('app.home.posts', 60 * 24, function () {
            return Post::published()
                ->orderByDesc('published_at')
                ->get()
                ->take(3);
        });

        return view('app.home', compact('posts'));
    }
}
