<?php

namespace App;

use Cache;
use Parsedown;
use Spatie\Tags\HasTags;
use Spatie\Feed\Feedable;
use Spatie\Feed\FeedItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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
     * Scope a query to include published resources only.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at');
    }

    /**
     * Is this reource published?
     *
     * @return bool
     */
    public function getIsPublishedAttribute(): bool
    {
        return is_null($this->published_at) === false;
    }

    /**
     * The published at datetime formatted for human eyes.
     *
     * @return string|null
     */
    public function getPublishedAtFormattedAttribute(): ?string
    {
        return optional($this->published_at)->format('M j, Y');
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

    /**
     * Get the route as an <a> element.
     *
     * @return string
     */
    public function getLinkAttribute()
    {
        return sprintf(
            '<a href="%s">%s</a>',
            $this->url,
            $this->title
        );
    }

    /**
     * Parse the Markdown content of the excerpt attribute.
     *
     * @return string
     */
    public function getExcerptHtmlAttribute(): string
    {
        $cacheKey = "post:{$this->id}:excerpt_html:{$this->updated_at->timestamp}";

        return Cache::rememberForever($cacheKey, function () {
            $parsedHtml = (new Parsedown())
                ->text($this->excerpt);

            // Stop <p> from wrapping <img>.
            $unwrappedHtml = preg_replace(
                '/<p>\\s*?(<a .*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s',
                '\1',
                $parsedHtml
            );

            // Fix mixed content.
            $unmixedContent = str_replace('http://', 'https://', $unwrappedHtml);

            return $unmixedContent;
        });
    }

    /**
     * Retrieve the content without tags.
     *
     * @return string
     */
    public function getBodyStrippedAttribute(): string
    {
        $cacheKey = "post:{$this->id}:body_stripped:{$this->updated_at->timestamp}";

        return Cache::rememberForever($cacheKey, function () {
            return strip_tags($this->body_html);
        });
    }

    /**
     * The body parsed through Markdown to generate HTML.
     *
     * @return string
     */
    public function getBodyHtmlAttribute(): string
    {
        $cacheKey = "post:{$this->id}:body_html:{$this->updated_at->timestamp}";

        return Cache::rememberForever($cacheKey, function () {
            $parsedHtml = (new Parsedown())
                ->text($this->body);

            // Stop <p> from wrapping <img>.
            $unwrappedHtml = preg_replace(
                '/<p>\\s*?(<a .*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s',
                '\1',
                $parsedHtml
            );

            // Fix mixed content.
            $unmixedContent = str_replace('http://', 'https://', $unwrappedHtml);

            return $unmixedContent;
        });
    }

    /**
     * How many words in the content?
     *
     * @return int
     */
    public function getWordCountAttribute(): int
    {
        $cacheKey = "post:{$this->id}:word_count:{$this->updated_at->timestamp}";

        return Cache::rememberForever($cacheKey, function () {
            return str_word_count($this->content_stripped);
        });
    }

    /**
     * How long in minutes does it aprox. take to read the post?
     *
     * The lowest reading time is set to 2.
     *
     * @return int
     */
    public function getReadingTimeAttribute(): int
    {
        $cacheKey = "post:{$this->id}:reading_time:{$this->updated_at->timestamp}";

        return Cache::rememberForever($cacheKey, function () {
            return max((int) ceil($this->word_count / 150), 2);
        });
    }
}
