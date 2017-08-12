<?php

/*
|--------------------------------------------------------------------------
| Views
|--------------------------------------------------------------------------
*/

Flight::set('flight.views.path', 'resources/views');

/**
 * @param  string  $filename
 * @return string
 *
 */
function asset_path($filename, $path = 'resources/')
{
    $manifest_path = 'resources/rev-manifest.json';

    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
        $manifest = [];
    }

    if (array_key_exists($filename, $manifest)) {
        return $path.$manifest[$filename];
    }

    return $path.$filename;
}

/**
 * @param  string  $filename
 * @return string
 *
 */
function css($filename)
{
    return asset_path($filename, '/resources/css/');
}

/**
 * @param  string  $filename
 * @return string
 *
 */
function img($filename)
{
    return asset_path($filename, '/resources/img/');
}
