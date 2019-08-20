<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the group for the skill.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function skillGroup()
    {
        return $this->belongsTo('App\SkillGroup');
    }
}
