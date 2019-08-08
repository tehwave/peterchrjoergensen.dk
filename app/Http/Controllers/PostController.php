<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Post;
use Validator;
use Spatie\Tags\Tag;
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('app.post.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
        $validator = Validator::make(request()->all(), [
            'title'     => 'required|string',
            'tags'      => 'nullable|string',
            'excerpt'   => 'nullable|string',
            'body'      => 'nullable|string',
            'publish'   => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return back()
                ->withInput()
                ->withErrors($validator);
        }

        $post = new Post([
            'title'         => request()->title,
            'slug'          => Str::slug(request()->title),
            'tags'          => Tag::findOrCreate(array_filter(explode(',', request()->tags)), 'Post'),
            'excerpt'       => request()->excerpt,
            'body'          => request()->body,
            'published_at'  => request()->published_at ? now() : null,
        ]);

        $post->save();

        return redirect()->route('post.show', $post->slug);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();

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

    /**
     * Show the form for editing the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function edit($slug)
    {
        $post = Post::where('slug', $slug)->first();

        return view('app.post.edit', compact('post'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function update($slug)
    {
        $validator = Validator::make(request()->all(), [
            'title'     => 'required|string',
            'tags'      => 'nullable|string',
            'excerpt'   => 'nullable|string',
            'body'      => 'nullable|string',
            'publish'   => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return back()
                ->withInput()
                ->withErrors($validator, 'update');
        }

        $post = Post::where('slug', $slug)->first();
        $tags = Tag::findOrCreate(array_filter(explode(',', request()->tags)), 'Post');
        $post->syncTags($tags);

        $post->title = request()->title;
        $post->slug = Str::slug(request()->title);
        $post->excerpt = request()->excerpt;
        $post->body = request()->body;
        $post->published_at = request()->published_at;

        $post->save();

        return redirect()->route('post.show', $post->slug);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        $validator = Validator::make(request()->all(), [
            'delete' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return back()
                ->withInput()
                ->withErrors($validator, 'destroy');
        }

        $post = Post::where('slug', $slug)->first();
        $post->delete();

        return redirect()->route('post.index');
    }
}
