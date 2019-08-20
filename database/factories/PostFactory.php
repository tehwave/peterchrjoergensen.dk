<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Post;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Post::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'slug' => Str::slug($faker->sentence),
        'excerpt' => $faker->paragraph,
        'body' => $faker->text,
        'published_at' => $faker->dateTime(),
    ];
});
