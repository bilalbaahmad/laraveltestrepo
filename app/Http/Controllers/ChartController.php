<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use function MongoDB\BSON\toJSON;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class ChartController extends Controller
{
    public function index()
    {
        /*$role = Role::create(['name' => 'admin']);
        $role = Role::create(['name' => 'pdf downloader']);
        $role = Role::create(['name' => 'excel downloader']);*/

        /*$permission = Permission::create(['name' => 'export pdf']);
        $permission = Permission::create(['name' => 'export excel']);*/

        /*$all_permissions = Permission::all();
        $excel_perm = Permission::findByName('export excel');
        $pdf_perm = Permission::findByName('export pdf');

        $admin_role = Role::findByName('admin');
        $excel_role = Role::findByName('excel downloader');
        $pdf_role = Role::findByName('pdf downloader');

        $admin_role->syncPermissions($all_permissions);
        $excel_role->givePermissionTo($excel_perm);
        $pdf_role->givePermissionTo($pdf_perm);*/

        /*$pdf_role = Role::findByName('pdf downloader');
        auth()->user()->assignRole($pdf_role);*/

        $permissions = auth()->user()->getAllPermissions();
        return  $permissions->tojson();

        return view('welcome');
    }
}
