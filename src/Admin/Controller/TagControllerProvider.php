<?php
namespace Ridibooks\Cms\Admin\Controller;

use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Admin\TagService as AdminTagService;
use Ridibooks\Cms\CmsApplication;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TagControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('/', [$this, 'tags']);
        $controllers->post('/', [$this, 'createTag']);
        $controllers->put('/{tag_id}', [$this, 'updateTag']);
        $controllers->delete('/{tag_id}', [$this, 'deleteTag']);
        $controllers->get('/{tag_id}/users', [$this, 'tagUsers']);
        $controllers->get('/{tag_id}/menus', [$this, 'tagMenus']);
        $controllers->put('/{tag_id}/menus/{menu_id}', [$this, 'addTagMenu']);
        $controllers->delete('/{tag_id}/menus/{menu_id}', [$this, 'deleteTagMenu']);

        return $controllers;
    }

    /**
     * @param CmsApplication $app
     * @param HttpException $e
     * @return mixed
     */
    private function sendErrorResponse(CmsApplication $app, HttpException $e)
    {
        $sentry_client = $app[SentryServiceProvider::SENTRY];
        if ($sentry_client) {
            $sentry_client->captureException($e);
        }

        return $e->getStatusCode();
    }

    public function tags(CmsApplication $app, Request $request)
    {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            return $app->json(AdminTagService::getAllTags());
        }

        return $app->render('super/tags.twig', [
            'title' => '태그 관리',
            'tags' => AdminTagService::getTagListWithUseCount(),
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

    public function deleteTag($tag_id, CmsApplication $app)
    {
        try {
            AdminTagService::deleteTag($tag_id);
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

    public function tagUsers(Application $app, Request $request, $tag_id)
    {
        $is_use = $request->get('is_use');
        return $app->json([
            'success' => true,
            'data' => AdminTagService::getMappedAdmins($tag_id, $is_use),
        ]);
    }

    public function tagMenus(Application $app, $tag_id)
    {
        return $app->json([
            'success' => true,
            'data' => [
                'menus' => AdminTagService::getMappedAdminMenuListForSelectBox($tag_id),
                'admins' => AdminTagService::getMappedAdmins($tag_id)
            ],
        ]);
    }

    public function addTagMenu(CmsApplication $app, $tag_id, $menu_id)
    {
        try {
            AdminTagService::insertTagMenu($tag_id, $menu_id);
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
