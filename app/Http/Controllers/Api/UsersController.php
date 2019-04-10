<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use App\User;
use Illuminate\Support\Facades\File as File;

class UsersController extends Controller
{
    public function allUsers()
    {
        $all_users = User::with('roles')->get();
        return $all_users;
    }
    public function userRoles($id)
    {
        $user_roles = User::where('id',$id)->with('roles')->first();
        return $user_roles;
    }

    public function updateUserRoles(Request $request)
    {
        $user_id= $request->user_id;
        $role_id = $request->role_id;
        $status = $request->status;

        if($status == '1')
        {
            $user = User::find($user_id);
            $role = Role::findById($role_id);
            $user->assignRole($role);
            return "Assigned";
        }
        else
        {
            $user = User::find($user_id);
            $role = Role::findById($role_id);
            $user->removeRole($role);
            return "Deleted";
        }
    }

    public function userDirectPermissions($id)
    {
        $user_id= $id;
        $user = User::find($user_id);
        $permissions = $user->getDirectPermissions();
        return $permissions;
    }

    public function updateUserDirectPermissions(Request $request)
    {
        $user_id= $request->user_id;
        $permission_id= $request->permission_id;
        $status = $request->status;

        if($status == '1')
        {
            $user = User::find($user_id);
            $permission = Permission::findById($permission_id);
            $user->givePermissionTo($permission);
            return "Assigned";
        }
        else
        {
            $user = User::find($user_id);
            $permission = Permission::findById($permission_id);
            $user->revokePermissionTo($permission);
            return "Deleted";
        }
    }

    public function download(Request $request)
    {
        $user = User::find($request->user()->id);

        if($user->hasPermissionTo('Download File'))
        {
            $image_physical_path = base_path().parent::file_path_getter()."/assets/images/test.png";

            $NewName = 'test_file.png';

            $headers = array('Content-Type: image/png');

            if (File::exists($image_physical_path))
            {
                return response()->download($image_physical_path, $NewName, $headers);
            }
            else
            {
                return "File Not Found";
            }
        }
        else
        {
            return "Access Denied";
        }
    }
}
