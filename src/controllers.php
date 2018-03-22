<?php
declare(strict_types=1);

use Ridibooks\Cms\Admin\Controller\LogControllerProvider;
use Ridibooks\Cms\Admin\Controller\MenuControllerProvider;
use Ridibooks\Cms\Admin\Controller\TagControllerProvider;
use Ridibooks\Cms\Admin\Controller\UserControllerProvider;
use Ridibooks\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

// web server
$app->mount('/logs', new LogControllerProvider());
$app->mount('/menus', new MenuControllerProvider());
$app->mount('/tags', new TagControllerProvider());
$app->mount('/users', new UserControllerProvider());

// check auth
$app->before(function (Request $request) {
    return MiniRouter::shouldRedirectForLogin($request);
});
