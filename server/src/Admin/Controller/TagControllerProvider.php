<?php
namespace Ridibooks\Platform\Cms\Admin\Controller;

use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Platform\Cms\Admin\TagService as AdminTagService;
use Ridibooks\Platform\Cms\CmsApplication;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class TagControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('tags', [$this, 'tags']);
        $controllers->post('tags', [$this, 'createTag']);
        $controllers->put('tags/{tag_id}', [$this, 'updateTag']);
        $controllers->delete('tags/{tag_id}', [$this, 'deleteTag']);
        $controllers->get('tags/{tag_id}/users', [$this, 'tagUsers']);
        $controllers->get('tags/{tag_id}/menus', [$this, 'tagMenus']);
        $controllers->put('tags/{tag_id}/menus/{menu_id}', [$this, 'addTagMenu']);
        $controllers->delete('tags/{tag_id}/menus/{menu_id}', [$this, 'deleteTagMenu']);

        return $controllers;
    }

    /**
     * @param CmsApplication $app
     * @param \Exception $e
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    private function sendJsonErrorResponse(CmsApplication $app, \Exception $e)
    {
        $sentry_client = $app[SentryServiceProvider::SENTRY];
        if ($sentry_client) {
            $sentry_client->captureException($e);
        }

        return $app->json([
            'success' => false,
            'msg' => ['오류가 발생하였습니다. 다시 시도하여 주세요. 문제가 다시 발생할 경우 개발그룹에 문의하여주세요.'],
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function tags(CmsApplication $app, Request $request)
    {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            return $app->json(AdminTagService::getAllTags());
        }

        return $app->render('super/tags.twig', [
            'title' => '태그 관리',
            'tags' => AdminTagService::getTagListWithUseCount()
        ]);
    }

    public function createTag(CmsApplication $app, Request $request)
    {
        $name = $request->get('name');
        $is_use = $request->get('is_use');

        try {
            AdminTagService::insertTag($name, $is_use);
            $app->addFlashInfo('성공적으로 등록하였습니다.');
        } catch (\Exception $e) {
            $app->addFlashError($e->getMessage());
        }

        return $app->redirect('/super/tags');
    }

    public function updateTag(CmsApplication $app, Request $request, $tag_id)
    {
        $name = $request->get('name');
        $is_use = $request->request->getBoolean('is_use');

        try {
            AdminTagService::updateTag($tag_id, $name, $is_use);

        } catch (\Exception $e) {
            return $this->sendJsonErrorResponse($app, $e);
        }

        return $app->json([
            'success' => true,
            'msg' => ['성공적으로 수정하였습니다'],
        ], Response::HTTP_OK);
    }

    public function deleteTag($tag_id, CmsApplication $app)
    {
        try {
            AdminTagService::deleteTag($tag_id);

        } catch (\Exception $e) {
            return $this->sendJsonErrorResponse($app, $e);
        }

        return $app->json([
            'success' => true,
            'msg' => ['성공적으로 수정하였습니다'],
        ], Response::HTTP_OK);
    }

    public function tagUsers($tag_id, Application $app)
    {
        return $app->json([
            'success' => true,
            'data' => AdminTagService::getMappedAdmins($tag_id),
        ], Response::HTTP_OK);
    }

    public function tagMenus(Application $app, $tag_id)
    {
        return $app->json([
            'success' => true,
            'data' =>[
                'menus' => AdminTagService::getMappedAdminMenuListForSelectBox($tag_id),
                'admins' => AdminTagService::getMappedAdmins($tag_id)
            ],
        ], Response::HTTP_OK);
    }

    public function addTagMenu(CmsApplication $app, $tag_id, $menu_id)
    {
        try {
            AdminTagService::insertTagMenu($tag_id, $menu_id);

        } catch (\Exception $e) {
            return $this->sendJsonErrorResponse($app, $e);
        }

        return $app->json([
            'success' => true,
            'msg' => ['성공적으로 수정하였습니다'],
        ], Response::HTTP_OK);
    }

    public function deleteTagMenu(Application $app, $tag_id, $menu_id)
    {
        try {
            AdminTagService::deleteTagMenu($tag_id, $menu_id);

        } catch (\Exception $e) {
            return $app->abort(Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return Response::create(Response::HTTP_NO_CONTENT);
    }
}
