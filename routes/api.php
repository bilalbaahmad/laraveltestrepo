<?php
use Illuminate\Http\Request;

Route::post('checkpaymentstatus', 'PaymentController@CheckPaymentStatus');
Route::post('refundpayment', 'PaymentController@RefundPayment');


Route::group(['middleware' => ['auth:api']], function () {

    //Get Routes
    Route::get('/user', function (Request $request){ return $request->user()->id; });
    Route::get('/allusers', 'Api\UsersController@allUsers');
    Route::get('/user/permissions', 'Api\UsersController@getUserPermissions');
    Route::get('/user/{id}/permissions', 'Api\UsersController@userDirectPermissions');
    Route::get('/user/{id}/roles', 'Api\UsersController@userRoles');

    Route::get('/allpermissions', 'Api\RolesPermissionsController@allPermissions');
    Route::get('/permission/{id}/view', 'Api\RolesPermissionsController@viewPermission');

    Route::get('/role/{id}/view', 'Api\RolesPermissionsController@viewRole');
    Route::get('/role/{id}/permissions', 'Api\RolesPermissionsController@viewRolePermissions');
    Route::get('/allroles', 'Api\RolesPermissionsController@allRoles');
    Route::get('/getfolder/{id}/content', 'Api\FileExplorerController@getFolderContent');
    Route::get('/file/{id}/download', 'Api\FileExplorerController@downloadFile');

    Route::get('paymentstatus', 'PaymentController@getPaymentStatus');



    //Post Routes
    Route::post('/user/logout', 'Api\UsersController@logout');
    Route::post('/user/permissions/update', 'Api\UsersController@updateUserDirectPermissions');
    Route::post('/user/roles/update', 'Api\UsersController@updateUserRoles');
    Route::post('/forecastdata', 'Api\UsersController@forecastData');

    Route::post('/permissions/add', 'Api\RolesPermissionsController@addPermission');
    Route::post('/permissions/update', 'Api\RolesPermissionsController@updatePermission');
    Route::post('/roles/add', 'Api\RolesPermissionsController@addRole');
    Route::post('/roles/update', 'Api\RolesPermissionsController@updateRole');
    Route::post('/role/permissions/update', 'Api\RolesPermissionsController@updateRolePermissions');

    Route::post('/folder/add', 'Api\FileExplorerController@addFolder');
    Route::post('/file/add', 'Api\FileExplorerController@addFile');
    Route::post('/update/filefolder/name', 'Api\FileExplorerController@renameFileFolder');

    Route::post('/paywithpaypal', 'PaymentController@payWithpaypal');



    //Delete Routes
    Route::delete('/permission/{id}/delete', 'Api\RolesPermissionsController@deletePermission');
    Route::delete('/role/{id}/delete', 'Api\RolesPermissionsController@deleteRole');
    Route::delete('/role/{r_id}/permission/{p_id}/delete', 'Api\RolesPermissionsController@deleteRolePermission');
    Route::delete('/filefolder/{id}/delete', 'Api\FileExplorerController@deleteFileFolder');
});


Route::post('/user/register', 'Api\UsersController@register');
