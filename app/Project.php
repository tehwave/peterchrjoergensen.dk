<?php

namespace App;

use App\Enums\ProjectType;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\HasMedia;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class Project extends Model implements HasMedia
{
    use HasMediaTrait;

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'type' => ProjectType::OTHER,
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'started_at',
        'finished_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'links' => 'array',
    ];

    /**
     * Register the media conversions.
     *
     * @return void
     */
    public function registerMediaConversions(Media $media = null)
    {
        $this->addMediaConversion('thumbnail')
            ->fit(Manipulations::FIT_CONTAIN, 64, 64)
            ->blur(10);
    }

    /**
     * Register the media collections.
     *
     * @return void
     */
    public function registerMediaCollections()
    {
        $this->addMediaCollection('logo')->singleFile();
    }

    /**
     * Get the institution attached to the project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get the company attached to the project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Does this project have links?
     *
     * @return string
     */
    public function hasLinks()
    {
        if (empty($this->links)) {
            return false;
        }

        return true;
    }

    /**
     * Resolve the filters.
     *
     * @return string
     */
    public function getFiltersAttribute()
    {
        $filters = collect([
            $this->type,
        ]);

        if (! empty($this->institution_id)) {
            $filters->push('institution');
        } elseif (! empty($this->company_id)) {
            $filters->push('company');
        } else {
            $filters->push('solo');
        }

        return $filters->implode(' ');
    }

    /**
     * Retrieve logo.
     *
     * @return string
     */
    public function getLogoAttribute()
    {
        return $this->getFirstMediaUrl('logo');
    }

    /**
     * Retrieve logo thumbnail.
     *
     * @return string
     */
    public function getLogoThumbnailAttribute()
    {
        return $this->getFirstMediaUrl('logo', 'thumbnail');
    }
}
