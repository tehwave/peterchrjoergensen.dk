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
        // $posts = Cache::remember('home.posts', 60 * 24, function () {
            $posts = Post::published()
                ->latest('published_at')
                ->take(4)
                ->get();
        // });
        return view('app.home', compact('posts'));
    }
}
