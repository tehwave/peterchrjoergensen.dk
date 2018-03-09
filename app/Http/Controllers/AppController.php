<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;

class AppController extends Controller
{
    /**
     * @return \Illuminate\Http\Response
     */
    public function home()
    {
        // TODO: Cache this
        $posts = Post::published()->orderByDesc('published_at')->get()->take(3);

        return view('app.home', compact('posts'));
    }
}
