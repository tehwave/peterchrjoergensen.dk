<?php

namespace App\Http\Controllers;

use App\Post;
use Validator;
use Carbon\Carbon;

class ArchiveController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $year
     * @param  int  $month
     * @param  int  $day
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

            $date = Carbon::parse($year.'-'.$month.'-'.$day)->toFormattedDateString();
        } elseif (isset($year) && isset($month)) {
            $posts = Post::published()
                ->orderBy('published_at', 'desc')
                ->whereYear('published_at', $year)
                ->whereMonth('published_at', $month)
                ->paginate(5);

            $date = Carbon::parse($year.'-'.$month)->format('M, Y');
        } else {
            $posts = Post::published()
                ->orderBy('published_at', 'desc')
                ->whereYear('published_at', $year)
                ->paginate(5);

            $date = Carbon::create($year)->year;
        }

        return view('app.archive.show', compact('posts', 'date'));
    }

    /**
     * Browse the archive.
     *
     * @return \Illuminate\Http\Response
     */
    public function browse()
    {
        $validator = Validator::make(request()->all(), [
            'year' => 'required_with:month,day',
            'month' => 'required_with:day',
        ]);

        if ($validator->fails()) {
            return back()
                ->withInput()
                ->withErrors($validator);
        }

        return redirect()->route('archive.show', [request()->year, request()->month, request()->day]);
    }
}
