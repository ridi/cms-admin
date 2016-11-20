<?php
use Ridibooks\Platform\Cms\Admin\Controller\MenuControllerProvider as AdminMenuController;
use Ridibooks\Platform\Cms\Admin\Controller\TagControllerProvider as AdminTagController;
use Ridibooks\Platform\Cms\Admin\Controller\UserControllerProvider as AdminUserController;
use Ridibooks\Platform\Cms\Auth\LoginService;
use Ridibooks\Platform\Cms\CmsApplication;
use Ridibooks\Platform\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

require_once __DIR__ . '/../config.php';

$autoloader = require __DIR__ . "/server/vendor/autoload.php";

LoginService::startSession();

$app = new CmsApplication();
$app['twig.path'] = [
	__DIR__ . '/server/views'
];

// Try MiniRouter first
$app->before(function (Request $request) {
	return MiniRouter::shouldRedirectForLogin($request);
});

$app->mount('/', new AdminUserController());
$app->mount('/', new AdminTagController());
$app->mount('/', new AdminMenuController());

$app->run();
