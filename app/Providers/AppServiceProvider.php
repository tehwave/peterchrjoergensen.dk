<?php

namespace App\Providers;

use Blade;
use Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        Blade::if('env', function ($environment) {
            return app()->environment($environment);
        });
    }
}
