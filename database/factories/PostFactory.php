<?php

use Faker\Generator as Faker;

$factory->define(App\Post::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'slug' => str_slug($faker->sentence),
        'excerpt' => $faker->paragraph,
        'body' => $faker->text,
        'published_at' => $faker->dateTime(),
    ];
});
