<?php
namespace Ridibooks\Cms\Admin\Controller;

use Ridibooks\Cms\Admin\LogService as AdminLogService;
use Ridibooks\Cms\Admin\UserService as AdminUserService;
use Ridibooks\Platform\Cms\CmsApplication;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('users', [$this, 'users']);
        $controllers->get('users/{user_id}', [$this, 'user']);
        $controllers->post('users/new', [$this, 'createUser']);
        $controllers->post('users/{user_id}', [$this, 'updateUser']);
        $controllers->delete('users/{user_id}', [$this, 'deleteUser']);
        $controllers->post('users/{user_id}/permissions', [$this, 'updateUserPermissions']);
        $controllers->get('users/{user_id}/logs/permissions', [$this, 'permissionLogs']);

        return $controllers;
    }

    public function users(CmsApplication $app, Request $request)
    {
        $page_index = $request->get('page', 1);
        $per_page = $request->get('per_page', 25);
        $search_text = $request->get('search_text', '');

        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            $start = $per_page * ($page_index - 1);
            return $app->json([
                'users' => AdminUserService::getAdminUserList($search_text, $start, $per_page),
                'count' => AdminUserService::getAdminUserCount($search_text),
            ]);
        }

        return $app->render('super/users.twig', [
            'page' => $page_index,
            'per_page' => $per_page,
            'search_text' => $search_text,
        ]);
    }

    public function user(CmsApplication $app, $user_id)
    {
        if ($user_id === 'new') {
            $user_id = '';
            $user = null;
            $tags = [];
            $menus = [];
        } else {
            $user = AdminUserService::getUser($user_id);
            if (!$user) {
                return $app->abort(Response::HTTP_NOT_FOUND);
            }
            $tags = AdminUserService::getAdminUserTag($user_id);
            $menus = AdminUserService::getAdminUserMenu($user_id);
        }

        return $app->render('super/user_edit.twig',
            [
                'userDetail' => $user,
                'userTag' => implode(',', $tags),
                'userMenu' => implode(',', $menus),
            ]
        );
    }

    public function createUser(CmsApplication $app, Request $request)
    {
        $user_id = trim($request->get('id'));
        $adminUser = [
            'id' => $user_id,
            'passwd' => $request->get('passwd'),
            'new_passwd' => $request->get('new_passwd'),
            'chk_passwd' => $request->get('chk_passwd'),
            'name' => $request->get('name'),
            'team' => $request->get('team'),
            'is_use' => $request->get('is_use', 0),
        ];

        try {
            AdminUserService::insertAdminUser($adminUser);
        } catch (\Exception $e) {
            $app->addFlashError($e->getMessage());
        }

        return $app->redirect('/super/users/' . $user_id);
    }

    public function updateUser(CmsApplication $app, Request $request, $user_id)
    {
        $user = AdminUserService::getUser($user_id);
        if (!$user) {
            return $app->abort(Response::HTTP_NOT_FOUND);
        }

        try {
            $adminUser = [
                'id' => $user_id,
                'passwd' => $request->get('passwd'),
                'new_passwd' => $request->get('new_passwd'),
                'chk_passwd' => $request->get('chk_passwd'),
                'name' => $request->get('name'),
                'team' => $request->get('team'),
                'is_use' => $request->get('is_use', 0),
            ];
            AdminUserService::updateUserInfo($adminUser);
            $app->addFlashInfo('성공적으로 수정하였습니다.');
        } catch (\Exception $e) {
            $app->addFlashError($e->getMessage());
        }

        return $app->redirect('/super/users/' . $user_id);
    }

    public function deleteUser(CmsApplication $app, $user_id)
    {
        $user = AdminUserService::getUser($user_id);
        if (!$user) {
            return $app->abort(Response::HTTP_NOT_FOUND);
        }

        try {
            AdminUserService::deleteUser($user_id);
        } catch (\Exception $e) {
            return $app->abort(Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return Response::create(Response::HTTP_NO_CONTENT);
    }

    public function updateUserPermissions(CmsApplication $app, Request $request, $user_id)
    {
        try {
            if ($request->get('tag_ids')) {
                $splited = explode(',', $request->get('tag_ids'));
                $tag_ids = array_map('intval', $splited);
            } else {
                $tag_ids = [];
            }

            if ($request->get('menu_ids')) {
                $splited = explode(',', $request->get('menu_ids'));
                $menu_ids = array_map('intval', $splited);
            } else {
                $menu_ids = [];
            }

            AdminLogService::updateUserPermissions($user_id, $tag_ids, $menu_ids);
            $app->addFlashInfo('성공적으로 수정하였습니다.');
        } catch (\Exception $e) {
            $app->addFlashError($e->getMessage());
        }

        return $app->redirect('/super/users/' . $user_id);
    }

    public function permissionLogs(CmsApplication $app, $user_id)
    {
        $logs = AdminUserService::permissionLogs($user_id);
        return $app->json($logs);
    }
}
