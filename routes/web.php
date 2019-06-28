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


/*Route::any( '(.*)',function(){
    return view('welcome');
});*/

Route::any('{all}', function(){
    return view('home');
})->where('all', '.*');


Auth::routes();
Route::get('/excel', 'ChartController@index');


/*
Route::get('/', 'HomeController@index')->name('home');
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/excel', 'ChartController@index')->middleware('role:admin');
Route::get('/viewexcel', 'ChartController@viewexcel')->middleware('role:admin|excel downloader');
Route::get('/viewpdf', 'ChartController@index')->middleware('role:admin|pdf downloader');*/