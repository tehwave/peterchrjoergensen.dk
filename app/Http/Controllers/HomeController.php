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
        $posts = Cache::remember('home.posts', now()->addHour(), function () {
            $posts = Post::published()
                ->latest('published_at')
                ->take(4)
                ->get();

            return $posts;
        });

        return view('app.home')
            ->withPosts($posts);
    }
}
