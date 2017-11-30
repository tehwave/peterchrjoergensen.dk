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

// Auth
Auth::routes();

// Home
Route::view('/', 'app.home')->name('home');
Route::redirect('/home', '/', 301);

// Portfolio
Route::get('portfolio', 'ProjectController@index')->name('portfolio');
Route::redirect('project', 'portfolio', 301)->name('project.index');
Route::redirect('projects', 'portfolio', 301);

// Curriculum Vitae
Route::get('curriculum-vitae', 'CurriculumVitaeController@index')->name('curriculum-vitae');
Route::redirect('cv', 'curriculum-vitae', 301)->name('cv');

// Blog
Route::prefix('blog')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::get('new', 'PostController@create')->name('post.create');
        Route::post('/', 'PostController@store')->name('post.store');
        Route::get('{slug}/edit', 'PostController@edit')->name('post.edit');
        Route::put('{slug}', 'PostController@update')->name('post.update');
        Route::delete('{slug}', 'PostController@destroy')->name('post.destroy');
    });

    Route::get('/', 'PostController@index')->name('post.index');
    Route::get('{slug}', 'PostController@show')->name('post.show');
});

