<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home
Route::view('/', 'app.home')->name('home');
Route::redirect('/home', '/', 301);

// Portfolio
Route::get('portfolio', 'ProjectController@index')->name('portfolio');
Route::redirect('project', 'portfolio', 301)->name('project.index');
Route::redirect('projects', 'portfolio', 301);
