<?php
declare(strict_types=1);

use Ridibooks\Cms\Admin\Controller\LogControllerProvider;
use Ridibooks\Cms\Admin\Controller\MenuControllerProvider;
use Ridibooks\Cms\Admin\Controller\TagControllerProvider;
use Ridibooks\Cms\Admin\Controller\UserControllerProvider;
use Ridibooks\Cms\Admin\Controller\GroupControllerProvider;
use Ridibooks\Cms\Admin\Lib\MiddlewareFactory;
use Ridibooks\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

// web server
$app->mount('/', new LogControllerProvider());
$app->mount('/', new MenuControllerProvider());
$app->mount('/', new TagControllerProvider());
$app->mount('/', new UserControllerProvider());
$app->mount('/', new GroupControllerProvider());

// check auth
$app->before(MiddlewareFactory::authRequired());
