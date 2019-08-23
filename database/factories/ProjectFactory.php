<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Company;
use App\Project;
use App\Institution;
use App\Enums\ProjectType;
use Faker\Generator as Faker;
use Bezhanov\Faker\ProviderCollectionHelper;
use Illuminate\Support\Arr;

$factory->define(Project::class, function (Faker $faker) {
    ProviderCollectionHelper::addAllProvidersTo($faker);

    // Random number of elements from assoc. array with keys intact.
    $links = [
        'Website' => '#',
        'Download' => '#',
        'Repository' => '#',
        'Video' => '#',
        'Trailer' => '#',
    ];

    $count = $faker->numberBetween(0, 3);

    $results = null;

    if ($count > 0) {
        $keys = array_rand($links, $count);

        foreach ((array) $keys as $key) {
            $results[$key] = $links[$key];
        }
    }

    $links = $results;

    return [
        'company_id' => optional($faker->optional(0.5, null)->randomDigit, function () {
            return factory(Company::class)->create()->id;
        }),
        'institution_id' => optional($faker->optional(0.5, null)->randomDigit, function () {
            return factory(Institution::class)->create()->id;
        }),
        'type' => ProjectType::getRandomValue(),
        'title' => $faker->catchPhrase,
        'summary' => $faker->optional()->paragraph,
        'links' => $links,
        'logo' => $faker->placeholder(),
        'started_at' => $faker->optional()->dateTime(),
        'finished_at' => $faker->optional()->dateTime(),
    ];
});
