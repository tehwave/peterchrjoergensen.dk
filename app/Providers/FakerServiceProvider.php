<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Bezhanov\Faker\ProviderCollectionHelper;

class FakerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('Faker', function($app) {
            $faker = \Faker\Factory::create();

            ProviderCollectionHelper::addAllProvidersTo($faker)

            return $faker;
        });
    }
}
