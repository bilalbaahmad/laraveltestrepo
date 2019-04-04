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

Route::get('/allpermissions', 'Api\RolesPermissionsController@allPermissions');
Route::get('/permissions/view/{id}', 'Api\RolesPermissionsController@viewPermission');
Route::get('/allroles', 'Api\RolesPermissionsController@allRoles');
Route::get('/roles/view/{id}', 'Api\RolesPermissionsController@viewRole');
Route::get('/role/{id}/permissions', 'Api\RolesPermissionsController@viewRolePermissions');
Route::get('/allusers', 'Api\UsersController@allUsers');
Route::get('/user/{id}/roles', 'Api\UsersController@userRoles');



Route::post('/permissions/add', 'Api\RolesPermissionsController@addPermission');
Route::post('/permissions/update', 'Api\RolesPermissionsController@updatePermission');
Route::post('/roles/add', 'Api\RolesPermissionsController@addRole');
Route::post('/roles/update', 'Api\RolesPermissionsController@updateRole');
Route::post('/role/permissions/update', 'Api\RolesPermissionsController@updateRolePermissions');
Route::post('/user/roles/update', 'Api\UsersController@updateUserRoles');


Route::delete('/permission/delete/{id}', 'Api\RolesPermissionsController@deletePermission');
Route::delete('/role/delete/{id}', 'Api\RolesPermissionsController@deleteRole');
Route::delete('/role/{r_id}/permission/delete/{p_id}', 'Api\RolesPermissionsController@deleteRolePermission');