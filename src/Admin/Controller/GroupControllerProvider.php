<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Controller;

use Ridibooks\Cms\Admin\GroupService;
use Ridibooks\Cms\CmsApplication;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;

class GroupControllerProvider implements ControllerProviderInterface
{
    /** @var GroupService */
    private $group_service;

    public function __construct()
    {
        $this->group_service = new GroupService();
    }

    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('/groups', [$this, 'getGroups']);
        $controllers->post('/groups', [$this, 'insertGroup']);

        $controllers->get('/groups/{group_id}', [$this, 'getGroup']);
        $controllers->put('/groups/{group_id}', [$this, 'updateGroup']);
        $controllers->delete('/groups/{group_id}', [$this, 'deleteGroup']);

        $controllers->get('/groups/{group_id}/users', [$this, 'getGroupUsers']);
        $controllers->post('/groups/{group_id}/users', [$this, 'insertGroupUser']);
        $controllers->delete('/groups/{group_id}/users/{user_id}', [$this, 'deleteGroupUser']);

        $controllers->get('/groups/{group_id}/tags', [$this, 'getGroupTags']);
        $controllers->post('/groups/{group_id}/tags', [$this, 'insertGroupTag']);
        $controllers->delete('/groups/{group_id}/tags/{tag_id}', [$this, 'deleteGroupTag']);

        return $controllers;
    }

    public function getGroups(CmsApplication $app, Request $request) {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            return $app->json($this->group_service->getGroups());
        }

        return $app->render('super/groups.twig', [
            'title' => '그룹 관리',
            'groups' => $this->group_service->getGroups(),
        ]);
    }

    public function insertGroup(CmsApplication $app, Request $request) {
        $group = [
            'name' => $request->get('name'),
            'is_use' => $request->request->getBoolean('is_use', true),
        ];

        try {
            $this->group_service->insertGroup($group);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function getGroup(CmsApplication $app, Request $request, int $group_id) {
        $group = $this->group_service->getGroup($group_id);

        return $app->json($group);
    }

    public function updateGroup(CmsApplication $app, Request $request, int $group_id) {
        $name = $request->get('name');
        $is_use = $request->request->getBoolean('is_use');
        if (empty($name) || !isset($is_use)) {
            return $app->json('Invalid parameters', 400);
        }

        try {
            $this->group_service->updateGroup($group_id, $name, $is_use);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function deleteGroup(CmsApplication $app, Request $request, int $group_id) {
        if (empty($group_id)) {
            return $app->json('`group_id` parameter is missing.', 400);
        }

        try {
            $this->group_service->deleteGroup($group_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function getGroupUsers(CmsApplication $app, Request $request, int $group_id) {
        if (empty($group_id)) {
            return $app->json('`group_id` parameter is missing.', 400);
        }

        try {
            $users = $this->group_service->getUsers($group_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json($users);
    }

    public function insertGroupUser(CmsApplication $app, Request $request, int $group_id) {
        $user_id = $request->get('user_id');
        if (empty($group_id) || empty($user_id)) {
            return $app->json('Invalid parameters.', 400);
        }

        try {
            $this->group_service->insertUser($group_id, $user_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function deleteGroupUser(CmsApplication $app, Request $request, int $group_id) {
        $user_id = $request->get('user_id');
        if (empty($group_id) || empty($user_id)) {
            return $app->json('Invalid parameters.', 400);
        }

        try {
            $this->group_service->deleteUser($group_id, $user_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function getGroupTags(CmsApplication $app, Request $request, int $group_id) {
        if (empty($group_id)) {
            return $app->json('`group_id` parameter is missing.', 400);
        }

        try {
            $tags = $this->group_service->getTags($group_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json($tags);
    }

    public function insertGroupTag(CmsApplication $app, Request $request, int $group_id) {
        $tag_id = $request->get('tag_id');
        if (empty($group_id) || empty($tag_id)) {
            return $app->json('Invalid parameters.', 400);
        }

        try {
            $this->group_service->insertTags($group_id, $tag_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }

    public function deleteGroupTag(CmsApplication $app, Request $request, int $group_id) {
        $tag_id = $request->get('tag_id');
        if (empty($group_id) || empty($tag_id)) {
            return $app->json('Invalid parameters.', 400);
        }

        try {
            $this->group_service->deleteTag($group_id, $tag_id);
        } catch (\Exception $e) {
            return $app->json($e->getMessage(), 400);
        }

        return $app->json();
    }
}