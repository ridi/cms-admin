<?php
namespace Ridibooks\Cms\Admin\Controller;

use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Admin\Service\MenuService as AdminMenuService;
use Ridibooks\Cms\CmsApplication;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class MenuControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('/menus', [$this, 'menus']);
        $controllers->post('/menus', [$this, 'createMenu']);
        $controllers->put('/menus', [$this, 'updateOrCreateMenus']);

        $controllers->get('/menus/{menu_id}/submenus', [$this, 'submenus']);
        $controllers->post('/menus/{menu_id}/submenus', [$this, 'createSubmenu']);
        $controllers->put('/menus/{menu_id}/submenus/{submenu_id}', [$this, 'updateSubmenu']);
        $controllers->delete('/menus/{menu_id}/submenus/{submenu_id}', [$this, 'deleteSubmenu']);

        $controllers->get('/menus/{menu_id}/users', [$this, 'users']);

        return $controllers;
    }

    /**
     * @param CmsApplication $app
     * @param HttpException $e
     * @return int|string
     */
    private function sendErrorResponse(CmsApplication $app, HttpException $e)
    {
        $sentry_client = $app[SentryServiceProvider::SENTRY];
        if ($sentry_client) {
            $sentry_client->captureException($e);
        }

        return $e->getStatusCode();
    }

    public function menus(CmsApplication $app, Request $request)
    {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            return $app->json(AdminMenuService::getMenuList(1));
        }

        return $app->render('super/menus.twig', [
            'title' => '메뉴 관리',
            'menu_list' => AdminMenuService::getMenuList(),
        ]);
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

    public function updateOrCreateMenus(CmsApplication $app, Request $request)
    {
        $menus = $request->request->all();

        try {
            AdminMenuService::updateOrCreateMenus($menus);
        } catch (\Exception $e) {
            if (!is_a($e, 'HttpException')) {
                $e = new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, $e->getMessage());
            }

            return $this->sendErrorResponse($app, $e);
        }

        return $app->json([
            'success' => true,
            'msg' => ['성공적으로 수정하였습니다'],
        ]);
    }

    public function submenus(CmsApplication $app, $menu_id)
    {
        return $app->json([
            'success' => true,
            'data' => AdminMenuService::getMenuAjaxList($menu_id),
        ]);
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
