<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use App;
use DB;
use App\User;
use Illuminate\Support\Facades\File as File;

class UsersController extends Controller
{
    public function getUserPermissions(Request $request)
    {
        $permissions_array = (array) null;
        $user_id = $request->user()->id;
        $user = User::find($user_id);
        $permissions = $user->getAllPermissions();

        foreach ($permissions as $permission)
        {
            $permissions_array[] = $permission->name;
        }

        return $permissions_array;
    }

    public function allUsers(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('View Users'))
        {
            $all_users = User::with('roles')->get();
            return $all_users;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function userRoles(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Manage User Roles'))
        {
            $user_roles = User::where('id',$id)->with('roles')->first();
            return $user_roles;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function updateUserRoles(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Manage User Roles'))
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
        else
        {
            return "Access Denied";
        }
    }

    public function userDirectPermissions(Request $request,$id)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Manage User Permissions'))
        {
            $user_id= $id;
            $user = User::find($user_id);
            $permissions = $user->getDirectPermissions();
            return $permissions;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function updateUserDirectPermissions(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Manage User Permissions'))
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
        else
        {
            return "Access Denied";
        }
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([ 'message' => 'Successfully logged out' ]);
    }

    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            ],
            [   'name.required' => 'Name Is Required.',
                'email.required' => 'Email Is Required.',
                'email.unique'      => 'Sorry, This Email Address Is Already Used By Another User. Please Try With Different One.',
                'password.required' => 'Password Is Required.',
                'password.min'      => 'Password Length Should Be More Than 8 Character Or Digit Or Mix.'
            ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        $token = $user->createToken('')->accessToken;

        return response()->json(['access_token' => $token], 200);
    }

    public function forecastData(Request $request)
    {
        $startDate = $request->startDate;
        $endDate = $request->endDate;
        $data[] = '';
        $count = 0;

        $forecast_data = DB::table('forecast_data')
            ->select('id','country as name','color')
            ->get();

        if($startDate == '' && $endDate == '')
        {
            foreach ($forecast_data as $forecast)
            {
                $yearly_data = App\forecast_yearly_data::where('forecast_data_id',$forecast->id)->pluck('data');
                $data[$count] = array_merge((array) $forecast ,array('data'=> $yearly_data));
                $count++;
            }
        }
        else
        {
            $start_arr = explode(' ',$startDate);
            $start_day = $start_arr[2];
            $start_month = $start_arr[1];
            $start_year = $start_arr[3];
            $start_date = $start_day.' '.$start_month.' '.$start_year;
            $new_start_date = strtotime($start_date);
            $converted_start_date = date('Y-m-d', $new_start_date);

            $end_arr = explode(' ',$endDate);
            $end_day = $end_arr[2];
            $end_month = $end_arr[1];
            $end_year = $end_arr[3];
            $end_date = $end_day.' '.$end_month.' '.$end_year;
            $new_end_date = strtotime($end_date);
            $converted_end_date = date('Y-m-d', $new_end_date);

            foreach ($forecast_data as $forecast)
            {
                error_log($forecast->id.'  '.$converted_start_date.'  '.$converted_end_date);
                $yearly_data = App\forecast_yearly_data::where('forecast_data_id',$forecast->id)->whereBetween('date', array($converted_start_date, $converted_end_date))->pluck('data');
                $data[$count] = array_merge((array) $forecast ,array('data'=> $yearly_data));
                $count++;
            }
        }

        return $data;
    }

}
