<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Institution;
use Faker\Generator as Faker;
use Bezhanov\Faker\ProviderCollectionHelper;

$factory->define(Institution::class, function (Faker $faker) {
    ProviderCollectionHelper::addAllProvidersTo($faker);

    return [
        'name' => $faker->secondarySchool,
    ];
});
