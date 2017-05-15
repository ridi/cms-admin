<?php
use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Thrift\ThriftService;
use Ridibooks\Platform\Cms\Admin\Controller\LogController as AdminLogController;
use Ridibooks\Platform\Cms\Admin\Controller\MenuControllerProvider as AdminMenuController;
use Ridibooks\Platform\Cms\Admin\Controller\TagControllerProvider as AdminTagController;
use Ridibooks\Platform\Cms\Admin\Controller\UserControllerProvider as AdminUserController;
use Ridibooks\Platform\Cms\Auth\LoginService;
use Ridibooks\Platform\Cms\CmsApplication;
use Ridibooks\Platform\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require __DIR__ . "/server/vendor/autoload.php";

if (is_readable('.env')) {
    $dotenv = new Dotenv\Dotenv(__DIR__, '.env');
    $dotenv->load();
}

require_once __DIR__ . "/bootstrap.php";

// set sentry service
$sentry_dsn = $_ENV['SENTRY_KEY'];
if (!empty($sentry_dsn)) {
    $client = new Raven_Client($sentry_dsn);
    $client->install();
}

// set thrift end point
$cms_rpc_url = $_ENV['CMS_RPC_URL'];
if (!empty($cms_rpc_url)) {
    ThriftService::setEndPoint($cms_rpc_url);
}

// start session
$couchbase_host = $_ENV['COUCHBASE_HOST'];
if (!empty($couchbase_host)) {
    LoginService::startCouchbaseSession(explode(',', $couchbase_host));
} else {
    LoginService::startSession();
}

$app = new CmsApplication();
$app['twig.path'] = [
    __DIR__ . '/server/views'
];

// set sentry service provider
if (!empty($sentry_dsn)) {
    $app->register(new SentryServiceProvider(), [
        SentryServiceProvider::SENTRY_OPTIONS => [
            SentryServiceProvider::OPT_DSN => $sentry_dsn,
        ]
    ]);
}

// try MiniRouter first
$app->before(function (Request $request) {
    return MiniRouter::shouldRedirectForLogin($request);
});

$app->mount('/', new AdminUserController());
$app->mount('/', new AdminTagController());
$app->mount('/', new AdminMenuController());
$app->mount('/', new AdminLogController());

$app->run();
