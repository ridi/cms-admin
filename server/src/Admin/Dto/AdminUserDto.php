<?php
namespace Ridibooks\Platform\Cms\Admin\Dto;

use Ridibooks\Platform\Common\Base\AdminBaseDto;

class AdminUserDto extends AdminBaseDto
{
    public $name;
    public $team;
    public $is_use;
    public $passwd;
    public $new_passwd;
    public $chk_passwd;
    public $last_id;
}
