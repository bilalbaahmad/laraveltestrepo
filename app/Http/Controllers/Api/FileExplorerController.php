<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\fileFolder;

class FileExplorerController extends Controller
{
    public function getFolderContent($parent_id)
    {
        if($parent_id == 0)
        {
            $parent_id = '#';
            $id = 0; // table primary key id
        }
        else
        {
            $data = fileFolder::where('id',$parent_id)->first(); // table primary key id
            $id = $data->parent;
        }

        $content = fileFolder::where('parent',$parent_id)->orderBy('type', 'ASC')->get();

        $res = array('upper_level_id' => $id,'content' => $content);
        return $res;
    }

    public function addFolder(Request $request)
    {
        $folder_id = $request->folder_id;
        $folder_name = $request->folder_name;

        $new_folder = new fileFolder();
        $new_folder->parent = $folder_id;
        $new_folder->text = ucfirst($folder_name);
        $new_folder->type = 1;
        $new_folder->icon = 'fas fa-folder-open';
        $new_folder->save();

        $content = fileFolder::where('parent',$folder_id)->get();
        return $content;
    }

    public function addFile(Request $request)
    {
        $folder_id = $request->folder_id;
        $file_data = $request->file_data;
        $file_name = $request->file_name;

        $new_folder = new fileFolder();
        $new_folder->parent = $folder_id;
        $new_folder->text = ucfirst($file_name);
        $new_folder->type = 2;
        $new_folder->icon = 'far fa-file';
        $new_folder->save();

        $content = fileFolder::where('parent',$folder_id)->get();
        return $content;
    }

    public function renameFileFolder(Request $request)
    {
        $folder_id = $request->folder_id;
        $rename_id = $request->rename_id;
        $new_name = $request->new_name;

        $file_folder = fileFolder::find($rename_id);
        $file_folder->text = $new_name;
        $file_folder->save();

        $content = fileFolder::where('parent',$folder_id)->get();
        return $content;
    }

}
