<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'educations';

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
     * Get the institution of the education.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Get the human readable date of the started_at and finished_at dates.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function getDateAttribute()
    {
        if (is_null($this->finished_at)) {
            return "{$this->started_at->format('Y')} –";
        }

        return "{$this->started_at->format('Y')} – {$this->finished_at->format('Y')}";
    }
}
