<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Company;
use App\Project;
use App\Institution;
use Faker\Generator as Faker;

$factory->define(Project::class, function (Faker $faker) {

    $links = [
        'Website' => '#',
        'Download' => '#',
        'Repository' => '#',
        'Video' => '#',
        'Trailer' => '#',
    ];

    return [
        'company_id' => optional($faker->optional(), function () {
            return factory(Company::class)->create()->id;
        }),
        'institution_id' => optional($faker->optional(), function () {
            return factory(Institution::class)->create()->id;
        }),
        'title' => $faker->catchPhrase,
        'summary' => $faker->optional()->paragraph,
        'links' => $faker->optional()->randomElements($links, $faker->numberBetween(1, count($links)))
        'started_at' => $faker->optional()->dateTime(),
        'finished_at' => $faker->optional()->dateTime(),
    ];
});
