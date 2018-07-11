<?php
namespace Ridibooks\Cms\Admin\Service;

use Illuminate\Database\Capsule\Manager as DB;
use Ridibooks\Cms\Admin\Model\AdminMenu;
use Ridibooks\Cms\Admin\Model\AdminMenuAjax;

class MenuService
{
    public static function getMenuList($is_use = null)
    {
        $query = AdminMenu::query();
        if (!is_null($is_use)) {
            $query->where('is_use', $is_use);
        }
        return $query->orderBy('menu_order')->get()->toArray();
    }

    public static function insertMenu(array $menu)
    {
        DB::connection()->transaction(function () use ($menu) {
            self::_validateMenu($menu);

            if ($menu['menu_order'] == null) { //메뉴 순서값이 없을 경우 메뉴 순서값을 max+1 해준다.
                $menu['menu_order'] = AdminMenu::max('menu_order') + 1;
            }

            if (!is_numeric($menu['menu_order'])) {
                throw new \Exception('메뉴 순서는 숫자만 입력 가능합니다.');
            }

            // push down every menu below
            AdminMenu::where('menu_order', '>=', $menu['menu_order'])
                ->increment('menu_order');

            // then insert
            AdminMenu::create($menu);
        });
    }

    public static function updateMenu(array $menu)
    {
        DB::connection()->transaction(function () use ($menu) {
            self::_validateMenu($menu);

            /** @var AdminMenu $adminMenu */
            $adminMenu = AdminMenu::find($menu['id']);
            $old_menu_order = $adminMenu->menu_order;
            $new_menu_order = $menu['menu_order'];

            if ($new_menu_order == null) { // 입력받은 메뉴 순서값 없을 경우 메뉴 순서값을 max+1 해준다.
                $max_order = AdminMenu::max('menu_order');
                $menu['menu_order'] = $max_order + 1;
            } else {
                if (!is_numeric($new_menu_order)) {
                    throw new \Exception('메뉴 순서는 숫자만 입력 가능합니다.');
                }

                if (AdminMenu::where('menu_order',
                    $new_menu_order)->first()
                ) { //입력받은 메뉴 순서값이 이미 존재하고 있을 경우 메뉴 순서를 재 정렬할 필요가 있다.
                    if ($old_menu_order > $new_menu_order) { //밑에 있는 메뉴를 위로 올릴때
                        AdminMenu::where('menu_order', '<', $old_menu_order)
                            ->where('menu_order', '>=', $new_menu_order)
                            ->increment('menu_order');
                    } elseif ($old_menu_order < $new_menu_order) { //위에 있는 메뉴를 아래로 내릴때
                        AdminMenu::where('menu_order', '>', $old_menu_order)
                            ->where('menu_order', '<=', $new_menu_order)
                            ->decrement('menu_order');
                    }
                }
            }

            $adminMenu->fill($menu);
            $adminMenu->save();
        });
    }

    public static function updateMenus(array $menus)
    {
        DB::connection()->transaction(function () use ($menus) {
            foreach ($menus as $menu) {
                self::updateMenu($menu);
            }
        });
    }

    public static function getMenuAjaxList($menu_id)
    {
        return AdminMenu::find($menu_id)->ajaxMenus->toArray();
    }

    public static function insertMenuAjax($menu_id, $submenu_url)
    {
        self::_validateMenuAjax($menu_id, $submenu_url);

        $submenu = new AdminMenuAjax();
        $submenu->menu_id = $menu_id;
        $submenu->ajax_url = $submenu_url;
        $submenu->save();
    }

    public static function updateMenuAjax($menu_id, $submenu_id, $submenu_url)
    {
        self::_validateMenuAjax($menu_id, $submenu_url);
        AdminMenuAjax::find($submenu_id)->update(['ajax_url' => $submenu_url]);
    }

    public static function deleteMenuAjax($menu_id, $submenu_id)
    {
        /** @var AdminMenuAjax $submenu */
        $submenu = AdminMenuAjax::find($submenu_id);
        if (!$submenu) {
            throw new \Exception('존재하지 않는 서브메뉴입니다.');
        }
        if ($submenu->menu_id != $menu_id) {
            throw new \Exception('잘못된 서브메뉴입니다.');
        }
        $submenu->delete();
    }

    public static function getUsersByMenuId($menu_id)
    {
        return AdminMenu::find($menu_id)->users->toArray();
    }

    private static function _validateMenu(array $menuArray)
    {
        if (!isset($menuArray['menu_title']) || $menuArray['menu_title'] === '') {
            throw new \Exception('메뉴 제목을 입력하여 주십시오.');
        }

        if (!isset($menuArray['menu_url']) || $menuArray['menu_url'] === '') {
            throw new \Exception('메뉴 URL을 입력하여 주십시오.');
        }

        if (!is_numeric($menuArray['menu_deep'])) {
            throw new \Exception('메뉴 깊이는 숫자만 입력 가능합니다.');
        }
    }

    private static function _validateMenuAjax($menu_id, $ajax_url)
    {
        if (!isset($menu_id) || $menu_id === '') {
            throw new \Exception('잘못된 메뉴 ID 입니다.' . ' / ' . $menu_id);
        }

        if (!isset($ajax_url) || $ajax_url === '') {
            throw new \Exception('메뉴 Ajax URL을 입력하여 주십시오.');
        }
    }
}
