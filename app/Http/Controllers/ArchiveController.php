<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use Carbon\Carbon;

class ArchiveController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show($year, $month = null, $day = null)
    {

        // Dirty, but not sure how to otherwise do it.
        // Let me know if there's an elegant solution to it.
        if (isset($year) && isset($month) && isset($day)) {
            $posts = Post::published()
                ->orderBy('published_at', 'desc')
                ->whereYear('published_at', $year)
                ->whereMonth('published_at', $month)
                ->whereDay('published_at', $day)
                ->paginate(5);

            $date = Carbon::parse($year .'-'. $month .'-'. $day)->toFormattedDateString();
        } else if (isset($year) && isset($month)) {
            $posts = Post::published()
                ->orderBy('published_at', 'desc')
                ->whereYear('published_at', $year)
                ->whereMonth('published_at', $month)
                ->paginate(5);

            $date = Carbon::parse($year .'-'. $month)->format('M, Y');
        } else {
            $posts = Post::published()
                ->orderBy('published_at', 'desc')
                ->whereYear('published_at', $year)
                ->paginate(5);

            $date = Carbon::create($year)->year;
        }


        return view('app.archive.show', compact('posts', 'date'));
    }
}
