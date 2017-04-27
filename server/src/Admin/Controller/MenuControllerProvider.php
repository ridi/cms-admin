<?php
namespace Ridibooks\Platform\Cms\Admin\Controller;

use Ridibooks\Platform\Cms\Admin\MenuService as AdminMenuService;
use Ridibooks\Platform\Cms\CmsApplication;
use Ridibooks\Platform\Common\Base\JsonDto;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MenuControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('menus', [$this, 'menus']);
        $controllers->post('menus', [$this, 'createMenu']);
        $controllers->put('menus/{menu_id}', [$this, 'updateMenu']);

        $controllers->get('menus/{menu_id}/submenus', [$this, 'submenus']);
        $controllers->post('menus/{menu_id}/submenus', [$this, 'createSubmenu']);
        $controllers->put('menus/{menu_id}/submenus/{submenu_id}', [$this, 'updateSubmenu']);
        $controllers->delete('menus/{menu_id}/submenus/{submenu_id}', [$this, 'deleteSubmenu']);

        $controllers->get('menus/{menu_id}/users', [$this, 'users']);

        return $controllers;
    }

    public function menus(CmsApplication $app, Request $request)
    {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            return $app->json(AdminMenuService::getMenuList(1));
        }

        return $app->render('super/menus.twig',
            [
                'title' => '메뉴 관리',
                'menu_list' => AdminMenuService::getMenuList()
            ]
        );
    }

    public function createMenu(CmsApplication $app, Request $request)
    {
        $menu = [
            'menu_title' => $request->get('menu_title'),
            'menu_url' => $request->get('menu_url'),
            'menu_order' => $request->get('menu_order'),
            'menu_deep' => $request->get('menu_deep', 0),
            'is_newtab' => $request->get('is_newtab', 0),
            'is_use' => $request->get('is_use', 0),
            'is_show' => $request->get('is_show', 0),
        ];

        try {
            AdminMenuService::insertMenu($menu);
            $app->addFlashInfo('성공적으로 등록하였습니다.');
        } catch (\Exception $e) {
            $app->addFlashError($e->getMessage());
        }

        return $app->redirect('/super/menus');
    }

    public function updateMenu(CmsApplication $app, Request $request, $menu_id)
    {
        $json_dto = new JsonDto();

        $menu = [
            'id' => $menu_id,
            'menu_title' => $request->get('menu_title'),
            'menu_url' => $request->get('menu_url'),
            'menu_order' => $request->get('menu_order'),
            'menu_deep' => $request->get('menu_deep', 0),
            'is_newtab' => $request->get('is_newtab', 0),
            'is_use' => $request->get('is_use', 0),
            'is_show' => $request->get('is_show', 0),
        ];

        try {
            AdminMenuService::updateMenu($menu);
            $json_dto->setMsg('성공적으로 수정하였습니다.');
        } catch (\Exception $e) {
            $json_dto->setException($e);
        }

        return $app->json((array)$json_dto);
    }

    public function submenus(CmsApplication $app, $menu_id)
    {
        $json = new JsonDto();
        $json->data = AdminMenuService::getMenuAjaxList($menu_id);

        return $app->json((array)$json);
    }

    public function createSubmenu(CmsApplication $app, Request $request, $menu_id)
    {
        $submenu_url = $request->get('ajax_url');

        try {
            AdminMenuService::insertMenuAjax($menu_id, $submenu_url);
        } catch (\Exception $e) {
            return $app->abort(Response::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage());
        }

        return Response::create('성공적으로 등록하였습니다.', Response::HTTP_CREATED);
    }

    public function updateSubmenu(CmsApplication $app, Request $request, $menu_id, $submenu_id)
    {
        $submenu_url = $request->get('ajax_url');

        try {
            AdminMenuService::updateMenuAjax($menu_id, $submenu_id, $submenu_url);
        } catch (\Exception $e) {
            return $app->abort(Response::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage());
        }

        return Response::create('성공적으로 수정하였습니다.');
    }

    public function deleteSubmenu(CmsApplication $app, $menu_id, $submenu_id)
    {
        try {
            AdminMenuService::deleteMenuAjax($menu_id, $submenu_id);
        } catch (\Exception $e) {
            return $app->abort(Response::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage());
        }

        return Response::create('성공적으로 삭제하였습니다.', Response::HTTP_NO_CONTENT);
    }

    public function users(CmsApplication $app, $menu_id)
    {
        $users = AdminMenuService::getUsersByMenuId($menu_id);

        return $app->json($users);
    }
}
