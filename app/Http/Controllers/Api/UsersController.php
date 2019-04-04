<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use App\User;

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
}
