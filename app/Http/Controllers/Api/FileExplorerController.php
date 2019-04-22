<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use DB;
use App\fileFolder;
use App\files;
use App\User;
use App\user_file_folder;

class FileExplorerController extends Controller
{
    public function getFolderContent(Request $request, $parent_id)
    {

        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('View Directory'))
        {
            if($parent_id == 0)
            {
                $parent_id = '#';
                $id = 0; // table primary key id
                $path = '/';

                $content = fileFolder::where('parent',$parent_id)->orderBy('type', 'ASC')->get();
            }
            else
            {
                $data = fileFolder::where('id',$parent_id)->first(); // table primary key id
                $id = $data->parent;

                $obj = new fileFolder();
                $path = $obj->getFilePath($parent_id);
                $path = '/'.$path;

                $content = DB::table('file_folder')
                    ->join('user_file_folder','user_file_folder.file_folder_id','=','file_folder.id')
                    ->select('file_folder.*')
                    ->where([['parent',$parent_id],['user_file_folder.user_id',$user_id]])
                    ->orderBy('type', 'ASC')
                    ->get();
            }

            $res = array('upper_level_id' => $id, 'content' => $content, 'directory_path' => $path);
            return $res;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function addFolder(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if($user->hasPermissionTo('Create Folder'))
        {
            $folder_id = $request->folder_id;
            $folder_name = $request->folder_name;

            $new_folder = new fileFolder();
            $new_folder->parent = $folder_id;
            $new_folder->name = $folder_name.'_'.$user_id.'_'.time();
            $new_folder->display_text = ucfirst($folder_name);
            $new_folder->type = 1;
            $new_folder->icon = 'fas fa-folder-open';
            $new_folder->save();

            $user_file_folder = new user_file_folder();
            $user_file_folder->user_id = $user_id;
            $user_file_folder->file_folder_id = $new_folder->id;
            $user_file_folder->save();

            $content = fileFolder::where('parent',$folder_id)->get();
            return $content;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function addFile(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);
        if($user->hasPermissionTo('Upload File'))
        {
            $folder_id = $request->folder_id;
            $file_name = $request->file_name;

            $obj = new fileFolder();
            $folder_path = $obj->getStorageFilePath($folder_id);

            $extension = $request->file('file_data')->getClientOriginalExtension();
            $type = $request->file('file_data')->getMimeType();
            $size = $request->file('file_data')->getSize();
            $path = $request->file('file_data')->storeAs($folder_path, $file_name.'_'.$user_id.'_'.time().'.'.$extension,'local');

            $new_file = new files();
            $new_file->path = $path;
            $new_file->name = $file_name.'_'.$user_id.'_'.time().'.'.$extension;
            $new_file->type = $type;
            $new_file->size = $size;
            $new_file->save();

            $new_folder = new fileFolder();
            $new_folder->parent = $folder_id;
            $new_folder->name = $file_name.'.'.$extension;
            $new_folder->display_text = ucfirst($file_name);
            $new_folder->icon = 'far fa-file';
            $new_folder->type = 2;
            $new_folder->file_id = $new_file->id;
            $new_folder->save();

            $user_file_folder = new user_file_folder();
            $user_file_folder->user_id = $user_id;
            $user_file_folder->file_folder_id = $new_folder->id;
            $user_file_folder->save();

            $res = array('file _path' => $path, 'type' => $type, 'size' => $size);
            return $res;
        }
        else
        {
            return "Access Denied";
        }
    }

    public function renameFileFolder(Request $request)
    {
        $folder_id = $request->folder_id;
        $rename_id = $request->rename_id;
        $new_name = $request->new_name;

        $file_folder = fileFolder::find($rename_id);
        $file_folder->display_text = ucfirst($new_name);
        $file_folder->save();

        $content = fileFolder::where('parent',$folder_id)->get();
        return $content;
    }

    public function downloadFile(Request $request, $id)
    {
        $user = User::find($request->user()->id);

        if($user->hasPermissionTo('Download File'))
        {
            $file_folder = fileFolder::find($id);
            $file = files::find($file_folder->file_id);
            if($file != null)
            {
                return response()->download(storage_path('app/'.$file->path),$file_folder->name);
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
