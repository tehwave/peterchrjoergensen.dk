<?php

/*
|--------------------------------------------------------------------------
| Views
|--------------------------------------------------------------------------
*/

Flight::set('flight.views.path', 'resources/views');

/**
* Handles view caching.
*
* @param  string $view Name of view to cache
*/
Flight::map('cache', function($view) {
    header("Cache-Control: public, max-age=31536000");
    return Flight::lastModified(filemtime(sprintf('./%s/%s%s', Flight::get('flight.views.path'), $view, Flight::get('flight.views.extension'))));
});
