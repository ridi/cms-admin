<?php
namespace Ridibooks\Cms\Admin\Model;

use Illuminate\Database\Eloquent\Model;

class AdminUserGroup extends Model
{
    protected $table = 'tb_admin2_user_group';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'is_use',
        'creator'
    ];

    public function users()
    {
        return $this->belongsToMany(
            AdminUser::class,
            'tb_admin2_user_group_users',
            'group_id',
            'user_id'
        );
    }
}
