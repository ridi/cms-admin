<?php
use Ridibooks\Cms\Admin\CmsAdminApplication;
use Ridibooks\Cms\Thrift\ThriftService;
use Ridibooks\Platform\Cms\Auth\LoginService;

$autoloader = require __DIR__ . "/server/vendor/autoload.php";

if (is_readable(__DIR__ . '/.env')) {
    $dotenv = new Dotenv\Dotenv(__DIR__, '.env');
    $dotenv->load();
}

require_once __DIR__ . "/bootstrap.php";

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

$app = new CmsAdminApplication([
    'debug' => $_ENV['DEBUG'],
    'sentry_key' => $_ENV['SENTRY_KEY'],
    'asset_manifest_path' => __DIR__ . '/client/dist/manifest.json',
    'asset_public_path' => '/super/client/dist',
]);

$app['twig.path'] = [
    __DIR__ . '/server/views'
];

$app->run();
