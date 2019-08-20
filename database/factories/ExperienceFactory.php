<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Company;
use App\Experience;
use Faker\Generator as Faker;

$factory->define(Experience::class, function (Faker $faker) {
    return [
        'company_id' => function () {
            return factory(Company::class)->create()->id;
        },
        'title' => $faker->educationalAttainment,
        'summary' => $faker->optional()->paragraph,
        'started_at' => $faker->dateTime(),
        'stopped_at' => $faker->optional()->dateTime(),
    ];
});
