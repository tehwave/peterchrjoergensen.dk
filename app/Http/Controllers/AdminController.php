<?php

namespace App\Http\Controllers;

use App\Post;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::all();

        return view('admin.index', compact('posts'));
    }
}
