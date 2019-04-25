<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use File;

class fileFolder extends Model
{
    protected $table = 'file_folder';
    protected $pathArray = [];
    protected $path = '';

    public function getFilePath($parent_id)
    {
        if($parent_id == '#')
        {
            $parent_id = 1;
        }

        $fileFolder = fileFolder::where('id',$parent_id)->first();

        if($fileFolder != '')
        {
            $this->pathArray[] = $fileFolder->display_text;
            $parent = $fileFolder->parent;

            if($parent == '#')
            {
                $this->path = implode('/', array_reverse($this->pathArray));
            }
            else
            {
                $this->getFilePath($fileFolder->parent);
            }
        }
        else
        {
            return 'not found';
        }

        $this->pathArray = [];
        return $this->path;
    }

    public function getStorageFilePath($parent_id)
    {
        if($parent_id == '#')
        {
            $parent_id = 1;
        }

        $fileFolder = fileFolder::where('id',$parent_id)->first();

        if($fileFolder != '')
        {
            $this->pathArray[] = $fileFolder->name;
            $parent = $fileFolder->parent;

            if($parent == '#')
            {
                $this->path = implode('/', array_reverse($this->pathArray));
            }
            else
            {
                $this->getStorageFilePath($fileFolder->parent);
            }
        }
        else
        {
            return 'not found';
        }

        $this->pathArray = [];
        return $this->path;
    }

    public function deleteDirectoryContent($id)
    {
        $fileFolder = fileFolder::where('id',$id)->first();
        //check if content id available or not
        if($fileFolder == '')
        {
            return 'Not Found';
        }
        else
        {
            //if received id is for file content type then delete directly
            if($fileFolder->type == 2)
            {
                $this->deleteFile($fileFolder->id);
                return 'File Deleted';
            }
            else
            {
                //if received id is for folder content type then get its contents
                $directoryContent = $this->getDirectoryContent($fileFolder->id);
                //if folder is empty then delete the folder
                if(count($directoryContent) == 0)
                {
                    $this->deleteFolder($fileFolder->id);
                    return 'Deleted';
                }
                else
                {
                    //recursively call the function for the contents of folder
                    foreach ($directoryContent as $content)
                    {
                        $this->deleteDirectoryContent($content->id);
                    }
                }
                $this->deleteFolder($fileFolder->id);

                return 'Folder Content Deleted';
            }
        }
    }

    public function deleteFile($id)
    {
        $file_folder = fileFolder::find($id);
        if($file_folder != '')
        {
            $file = files::find($file_folder->file_id);
            if($file != '')
            {
                $path = storage_path('app/').$file->path;
                if (File::exists($path))
                {
                    File::delete($path);
                    $file->delete();
                }
                else
                {
                    return 'File Not Found';
                }

                return 'Deleted';
            }
            else
            {
                return 'Files Data Not Found';
            }
        }
        else
        {
            return 'File/Folder Data Not Found';
        }
    }

    public function deleteFolder($id)
    {
        $file_folder = fileFolder::find($id);
        if($file_folder != '')
        {
            $folder_path = storage_path('app/').$this->getStorageFilePath($id);
            if (File::exists($folder_path))
            {
                File::deleteDirectory($folder_path);
            }

            $file_folder->delete();
            return 'Deleted';
        }
        else
        {
            return 'File/Folder Data Not Found';
        }
    }

    public function getDirectoryContent($id)
    {
        $content = fileFolder::where('parent',$id)->orderBy('type', 'ASC')->get();
        return $content;
    }
}

