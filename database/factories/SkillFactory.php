<?php

use App\Skill;
use App\SkillGroup;
use Faker\Generator as Faker;

$factory->define(Skill::class, function (Faker $faker) {
    return [
        'skill_group_id' => function () {
            return factory(SkillGroup::class)->create()->id;
        },
        'name' => $faker->word,
    ];
});
