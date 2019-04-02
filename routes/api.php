<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function ()
{
    return "hello";
});

Route::get('/allpermissions', 'ApiController@allPermissions');
Route::get('/allroles', 'ApiController@allRoles');
Route::get('/permissions/delete/{id}', 'ApiController@deletePermission');
Route::get('/roles/delete/{id}', 'ApiController@deleteRole');
