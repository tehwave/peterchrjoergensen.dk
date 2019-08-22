<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
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
     * Get the institution attached to the project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function institution()
    {
        return $this->belongsTo('App\Institution');
    }

    /**
     * Get the company attached to the project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo('App\Company');
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
        return '';
    }

    /**
     * Retrieve logo. Hardcoding this to asset for now.
     *
     * @return string
     */
    public function getLogoAttribute($logo)
    {
        return $logo;
    }

    /**
     * Retrieve logo thumbnail. Hardcoding this to normal logo for now.
     *
     * @return string
     */
    public function getLogoThumbnailAttribute()
    {
        return $this->logo;
    }
}
