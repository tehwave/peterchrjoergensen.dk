<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Company;
use App\Experience;
use Faker\Generator as Faker;
use Bezhanov\Faker\ProviderCollectionHelper;

$factory->define(Experience::class, function (Faker $faker) {
    ProviderCollectionHelper::addAllProvidersTo($faker);

    return [
        'company_id' => function () {
            return factory(Company::class)->create()->id;
        },
        'title' => $faker->jobTitle,
        'summary' => $faker->optional()->paragraph,
        'started_at' => $faker->dateTime(),
        'stopped_at' => $faker->optional()->dateTime(),
    ];
});
