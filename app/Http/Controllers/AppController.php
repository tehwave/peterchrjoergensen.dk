<?php

namespace App\Http\Controllers;

use Cache;
use App\Post;

class AppController extends Controller
{
    /**
     * @return \Illuminate\Http\Response
     */
    public function home()
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
