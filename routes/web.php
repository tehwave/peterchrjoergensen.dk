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

// Home.
Route::get('/', 'HomeController')->name('home');
Route::permanentRedirect('home', '/');

// Portfolio.
Route::get('portfolio', 'ProjectController@index')->name('portfolio');
Route::permanentRedirect('project', '/portfolio')->name('project.index');
Route::permanentRedirect('projects', '/portfolio');

// Resume.
Route::get('resume', 'ResumeController')->name('resume');

// Curriculum Vitae.
Route::permanentRedirect('curriculum-vitae', '/resume');
Route::permanentRedirect('cv', '/resume');

// Feeds.
Route::feeds('feed');

// Redirects.
Route::permanentRedirect('firkant', 'https://firkant.website');
Route::permanentRedirect('FIRKANT', 'https://firkant.website');

// Blog.
Route::get('blog', 'PostController@index')->name('blog');
Route::permanentRedirect('posts', '/blog')->name('post.index');
Route::get('{post}', 'PostController@show')->name('post.show');
