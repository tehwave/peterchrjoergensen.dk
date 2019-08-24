<?php

namespace App;

use Parsedown;
use Spatie\Tags\HasTags;
use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;
use Illuminate\Database\Eloquent\Model;

class Post extends Model implements Feedable
{
    use HasTags;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'published_at',
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the indexable feed item for the model.
     *
     * @return \Spatie\Feed\FeedItem
     */
    public function toFeedItem()
    {
        return FeedItem::create()
            ->id($this->id)
            ->title($this->title)
            ->summary($this->excerpt ?? '')
            ->updated($this->updated_at)
            ->link($this->url)
            ->author('Peter Christian Jørgensen');
    }

    /**
     * Get collection of models for the model feed.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getFeedItems()
    {
        return self::published()
            ->orderByDesc('published_at')
            ->limit(100)
            ->get();
    }

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
     * Is this post published?
     *
     * @return bool
     */
    public function isPublished()
    {
        return is_null($this->published_at) === false;
    }

    /**
     * Parse the Markdown content of the excerpt attribute.
     *
     * @return HTML
     */
    public function getExcerptHtmlAttribute()
    {
        return (new Parsedown())
            ->text($this->excerpt);
    }

    /**
     * Parse the Markdown content of the body attribute.
     *
     * @return HTML
     */
    public function getBodyHtmlAttribute()
    {
        $body = (new Parsedown())
            ->text($this->body);

        // Stop <p> from wrapping <img>.
        return preg_replace('/<p>\\s*?(<a .*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s', '\1', $body);
    }

    /**
     * Get the route for this specific post.
     *
     * @return string
     */
    public function getUrlAttribute()
    {
        return route('post.show', $this->slug);
    }
}
