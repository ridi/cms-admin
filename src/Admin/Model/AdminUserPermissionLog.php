<?php
namespace Ridibooks\Cms\Admin\Model;

use Illuminate\Database\Eloquent\Model;

class AdminUserPermissionLog extends Model
{
    protected $table = 'tb_admin2_user_permission_log';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'menu_ids',
        'tag_ids',
        'edited_by'
    ];

    protected $casts = [
        'user_id' => 'string',
        'menu_ids' => 'string',
        'tag_ids' => 'string',
        'edited_by' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(
            AdminUser::class
        );
    }
}
