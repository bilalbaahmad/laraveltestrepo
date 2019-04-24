<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use App\User;

class RolesPermissionsController extends Controller
{
    public function allPermissions(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('View Permissions'))
        {
            $all_permissions = Permission::all();
            return $all_permissions;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function addPermission(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Add Permission'))
        {
            $permission_name = ucwords($request->permission);
            $new_permission = Permission::create(['guard_name' => 'api', 'name' => $permission_name]);
            return $permission_name;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function viewPermission(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Edit Permission'))
        {
            $permission_id = $id;
            $permission = Permission::findById($permission_id);
            return $permission;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function updatePermission(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Edit Permission'))
        {
            $permission_id = $request->permission_id;
            $permission_name = ucwords($request->permission);
            $permission = Permission::findById($permission_id);
            $permission->name = $permission_name;
            $permission->save();
            return $permission_name;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function deletePermission(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Delete Permission'))
        {
            $permission_id = $id;
            $permission = Permission::findById($permission_id);
            $permission->delete();
        }
        else
        {
            return "Access Denied";
        }
    }

    public function allRoles(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('View Roles'))
        {
            $all_roles = Role::all();
            return $all_roles;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function addRole(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Add Role'))
        {
            $role_name = ucwords($request->role);
            $new_role = Role::create(['guard_name' => 'api', 'name' => $role_name]);
            return $role_name;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function viewRole(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Edit Role'))
        {
            $role_id = $id;
            $role = Role::findById($role_id);
            return $role;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function updateRole(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Edit Role'))
        {
            $role_id = $request->role_id;
            $role_name = ucwords($request->role);
            $role = Role::findById($role_id);
            $role->name = $role_name;
            $role->save();
            return $role_name;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function deleteRole(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Delete Role'))
        {
            $role_id = $id;
            $role = Role::findById($role_id);
            $role->delete();
        }
        else
        {
            return "Access Denied";
        }
    }

    public function viewRolePermissions(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('View Role Permissions'))
        {
            $role_id = $id;
            $role = Role::findById($role_id);
            $role_details = $role->load('permissions');
            return $role_details->permissions;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function updateRolePermissions(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Edit Role Permission'))
        {
            $status = $request->status;
            $role_id = $request->role_id;
            $permission_id = $request->permission_id;

            if($status == '1')
            {
                $role = Role::findById($role_id);
                $permission = Permission::findById($permission_id);
                $role->givePermissionTo($permission);
                return "Assigned";
            }
            else
            {
                $role = Role::findById($role_id);
                $permission = Permission::findById($permission_id);
                $role->revokePermissionTo($permission);
                return "Deleted";
            }
        }
        else
        {
            return "Access Denied";
        }
    }

    public function deleteRolePermission(Request $request,$r_id,$p_id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Delete Role Permission'))
        {
            $role_id = $r_id;
            $permission_id = $p_id;

            $role = Role::findById($role_id);
            $permission = Permission::findById($permission_id);
            $role->revokePermissionTo($permission);
        }
        else
        {
            return "Access Denied";
        }
    }
}
