<?php

use App\Post;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

$factory->define(Post::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence,
        'slug' => Str::slug($faker->sentence),
        'excerpt' => $faker->optional()->paragraph,
        'body' => $faker->optional()->text,
        'published_at' => $faker->optional()->dateTime(),
    ];
});
