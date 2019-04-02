<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class client extends Model
{
    use HasRoles;

    protected $guard_name = 'web';

    protected $table = 'client';
}
