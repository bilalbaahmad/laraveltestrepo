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

    public function allRoles()
    {
        $all_roles = Role::all();
        return $all_roles;
    }
}
