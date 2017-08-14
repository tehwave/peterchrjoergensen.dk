<?php

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is where all of the routes that are handled
| by the application are defined.
|
*/

Flight::route('/', ['Controller', 'home']);
Flight::route('/cv', ['Controller', 'cv']);
Flight::route('/portfolio', ['Controller', 'portfolio']);
Flight::route('/index.php', function () {
    Flight::redirect('/');
});
