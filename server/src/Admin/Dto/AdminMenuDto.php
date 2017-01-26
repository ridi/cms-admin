<?php
namespace Ridibooks\Platform\Cms\Admin\Dto;

use Ridibooks\Platform\Common\Base\AdminBaseDto;

class AdminMenuDto extends AdminBaseDto
{
    public $menu_title;
    public $menu_url;
    public $menu_order;
    public $menu_deep;
    public $is_newtab;
    public $is_use;
    public $is_show;

    /**
     * @param mixed $param
     */
    public function __construct($param)
    {
        parent::__construct($param);
        $this->menu_deep = $this->menu_deep ? $this->menu_deep : 0;
    }
}
