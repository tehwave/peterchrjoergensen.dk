<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the educations for the institution.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function educations()
    {
        return $this->hasMany('App\Education');
    }
}
