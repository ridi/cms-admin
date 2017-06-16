<?php

namespace Ridibooks\Platform\Cms\Admin\Controller;

use Ridibooks\Platform\Cms\Admin\LogService;
use Ridibooks\Platform\Cms\Admin\Model\AdminUserPermissionLog;
use Ridibooks\Platform\Cms\Admin\Util\Util;
use Ridibooks\Platform\Cms\CmsApplication;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LogController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        /** @var ControllerCollection $controllers */
        $controllers = $app['controllers_factory'];

        $controllers->get('logs', [$this, 'index']);
        $controllers->get('logs/user', [$this, 'getUserLog']);

        return $controllers;
    }

    public function index(CmsApplication $app, Request $request)
    {
        return $app->render('super/logs.twig', [
            'asset_url' => Util::getVersionedAssetUrl('logs'),
        ]);
    }

    public function getUserLog(CmsApplication $app, Request $request)
    {
        if (in_array('application/json', $request->getAcceptableContentTypes())) {
            $page_index = $request->get('page', 1);
            $per_page = $request->get('per_page', 25);
            $json = [
                'rows' => LogService::getUserPermissions($page_index, $per_page),
                'count' => AdminUserPermissionLog::count(),
            ];

            return JsonResponse::create($json);
        }

        return Response::create('not acceptable', Response::HTTP_NOT_ACCEPTABLE);
    }
}
