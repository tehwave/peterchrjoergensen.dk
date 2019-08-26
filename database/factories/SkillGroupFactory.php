<?php

use App\SkillGroup;
use Faker\Generator as Faker;

$factory->define(SkillGroup::class, function (Faker $faker) {
    return [
        'name' => $faker->word,
    ];
});
