<?php

namespace App;

use Parsedown;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'published_at',
    ];

    /**
     * Scope a query to only include published posts.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    /**
     * Parse the Markdown content of the excerpt attribute.
     *
     * @return HTML
     */
    public function excerpt()
    {
        return (new Parsedown())
            ->text($this->excerpt);
    }

    /**
     * Parse the Markdown content of the body attribute.
     *
     * @return HTML
     */
    public function body()
    {
        return (new Parsedown())
            ->setMarkupEscaped(false)
            ->text($this->body);
    }
}
