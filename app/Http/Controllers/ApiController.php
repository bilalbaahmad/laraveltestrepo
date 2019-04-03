<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ApiController extends Controller
{
    public function allPermissions()
    {
        $all_permissions = Permission::all();
        return $all_permissions;
    }

    public function addPermission(Request $request)
    {
        $permission_name = $request->permission;
        $new_permission = Permission::create(['name' => $permission_name]);
        return $permission_name;
    }

    public function viewPermission($id)
    {
        $permission_id = $id;
        $permission = Permission::findById($permission_id);
        return $permission;
    }

    public function updatePermission(Request $request)
    {
        $permission_id = $request->permission_id;
        $permission_name = $request->permission;
        $permission = Permission::findById($permission_id);
        $permission->name = $permission_name;
        $permission->save();
        return $permission_name;
    }

    public function deletePermission($id)
    {
        $permission_id = $id;
        $permission = Permission::findById($permission_id);
        $permission->delete();
    }

    public function allRoles()
    {
        $all_roles = Role::all();
        return $all_roles;
    }

    public function addRole(Request $request)
    {
        $role_name = $request->role;
        $new_role = Role::create(['name' => $role_name]);
        return $role_name;
    }

    public function viewRole($id)
    {
        $role_id = $id;
        $role = Role::findById($role_id);
        return $role;
    }

    public function updateRole(Request $request)
    {
        $role_id = $request->role_id;
        $role_name = $request->role;
        $role = Role::findById($role_id);
        $role->name = $role_name;
        $role->save();
        return $role_name;
    }

    public function deleteRole($id)
    {
        $role_id = $id;
        $role = Role::findById($role_id);
        $role->delete();
    }
}