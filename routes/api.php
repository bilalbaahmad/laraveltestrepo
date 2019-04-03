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
Route::get('/permissions/view/{id}', 'ApiController@viewPermission');
Route::get('/roles/view/{id}', 'ApiController@viewRole');
Route::get('/role/{id}/permissions', 'ApiController@viewRolePermissions');

Route::post('/permissions/add', 'ApiController@addPermission');
Route::post('/permissions/update', 'ApiController@updatePermission');
Route::post('/roles/add', 'ApiController@addRole');
Route::post('/roles/update', 'ApiController@updateRole');

Route::delete('/permission/delete/{id}', 'ApiController@deletePermission');
Route::delete('/role/delete/{id}', 'ApiController@deleteRole');
Route::delete('/role/{r_id}/permission/delete/{p_id}', 'ApiController@deleteRolePermission');