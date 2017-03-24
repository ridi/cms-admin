<?php
use Ridibooks\Cms\Thrift\ThriftService;
use Ridibooks\Platform\Cms\Admin\Controller\MenuControllerProvider as AdminMenuController;
use Ridibooks\Platform\Cms\Admin\Controller\TagControllerProvider as AdminTagController;
use Ridibooks\Platform\Cms\Admin\Controller\UserControllerProvider as AdminUserController;
use Ridibooks\Platform\Cms\Auth\LoginService;
use Ridibooks\Platform\Cms\CmsApplication;
use Ridibooks\Platform\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

require_once 'config.local.php';
$autoloader = require __DIR__ . "/server/vendor/autoload.php";

// set sentry service
$sentry_dsn = \Config::$SENTRY_KEY;
if (isset($sentry_dsn)) {
    $client = new Raven_Client($sentry_dsn);
    $client->install();
}

// set thrift end point
if (isset(\Config::$CMS_RPC_URL)) {
    ThriftService::setEndPoint(\Config::$CMS_RPC_URL);
}

// start session
if (isset(\Config::$COUCHBASE_ENABLE) && \Config::$COUCHBASE_ENABLE) {
    LoginService::startCouchbaseSession(\Config::$COUCHBASE_SERVER_HOSTS);
} else {
    LoginService::startSession();
}

$app = new CmsApplication([
    'twig.path' => __DIR__ . '/server/views'
]);

// try MiniRouter first
$app->before(function (Request $request) {
    return MiniRouter::shouldRedirectForLogin($request);
});

$app->mount('/', new AdminUserController());
$app->mount('/', new AdminTagController());
$app->mount('/', new AdminMenuController());

$app->run();
