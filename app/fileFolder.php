<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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

        return $this->path;
    }
}

