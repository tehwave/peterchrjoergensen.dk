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

Flight::route('/', array('Controller', 'home'));
Flight::route('/cv', array('Controller', 'cv'));
Flight::route('/portfolio', array('Controller', 'portfolio'));