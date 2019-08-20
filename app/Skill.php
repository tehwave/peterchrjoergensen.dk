<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
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
