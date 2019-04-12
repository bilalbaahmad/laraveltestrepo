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



Route::group(['middleware' => ['auth:api']], function () {

    Route::get('/user', function (Request $request){ return $request->user()->id; });
    Route::get('/download', 'Api\UsersController@download');
});


Route::get('/allpermissions', 'Api\RolesPermissionsController@allPermissions');
Route::get('/permission/{id}/view', 'Api\RolesPermissionsController@viewPermission');
Route::get('/allroles', 'Api\RolesPermissionsController@allRoles');
Route::get('/role/{id}/view', 'Api\RolesPermissionsController@viewRole');
Route::get('/role/{id}/permissions', 'Api\RolesPermissionsController@viewRolePermissions');
Route::get('/allusers', 'Api\UsersController@allUsers');
Route::get('/user/{id}/roles', 'Api\UsersController@userRoles');
Route::get('/user/{id}/permissions', 'Api\UsersController@userDirectPermissions');



Route::post('/permissions/add', 'Api\RolesPermissionsController@addPermission');
Route::post('/permissions/update', 'Api\RolesPermissionsController@updatePermission');
Route::post('/roles/add', 'Api\RolesPermissionsController@addRole');
Route::post('/roles/update', 'Api\RolesPermissionsController@updateRole');
Route::post('/role/permissions/update', 'Api\RolesPermissionsController@updateRolePermissions');
Route::post('/user/roles/update', 'Api\UsersController@updateUserRoles');
Route::post('/user/permissions/update', 'Api\UsersController@updateUserDirectPermissions');
Route::post('/user/register', 'Api\UsersController@register');


Route::delete('/permission/{id}/delete', 'Api\RolesPermissionsController@deletePermission');
Route::delete('/role/{id}/delete', 'Api\RolesPermissionsController@deleteRole');
Route::delete('/role/{r_id}/permission/{p_id}/delete', 'Api\RolesPermissionsController@deleteRolePermission');