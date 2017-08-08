<?php

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/

require 'vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Configure the Application
|--------------------------------------------------------------------------
*/

require_once 'config/app.php';

/*
|--------------------------------------------------------------------------
| Register the Controllers
|--------------------------------------------------------------------------
*/

require_once 'app/controllers.php';

/*
|--------------------------------------------------------------------------
| Register the Routes
|--------------------------------------------------------------------------
*/

require_once 'app/routes.php';

/*
|--------------------------------------------------------------------------
| Start The Application
|--------------------------------------------------------------------------
*/

Flight::start();
