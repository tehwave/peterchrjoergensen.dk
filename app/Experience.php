<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
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
        'stopped_at',
    ];

    /**
     * Get the company of the experience.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the human readable date of the started_at and stopped_at dates.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function getDateAttribute()
    {
        if (is_null($this->stopped_at)) {
            return "{$this->started_at->format('Y')} –";
        }

        return "{$this->started_at->format('Y')} – {$this->stopped_at->format('Y')}";
    }
}
