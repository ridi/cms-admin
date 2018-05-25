<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Model;

use Illuminate\Database\Eloquent\Model;

class AdminGroup extends Model
{
    protected $table = 'tb_admin2_group';

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
            'tb_admin2_group_user',
            'group_id',
            'user_id'
        );
    }
}
