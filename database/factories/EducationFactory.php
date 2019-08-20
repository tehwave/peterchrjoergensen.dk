<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Education;
use App\Institution;
use Faker\Generator as Faker;

$factory->define(Education::class, function (Faker $faker) {
    return [
        'institution_id' => function () {
            return factory(Institution::class)->create()->id;
        },
        'title' => $faker->educationalAttainment,
        'summary' => $faker->optional()->paragraph,
        'started_at' => $faker->dateTime(),
        'finished_at' => $faker->optional()->dateTime(),
    ];
});
