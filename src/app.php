<?php
declare(strict_types=1);

use JG\Silex\Provider\CapsuleServiceProvider;
use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Admin\WebpackManifestVersionStrategy;
use Ridibooks\Cms\CmsApplication;
use Symfony\Component\Asset\PathPackage;
use Symfony\Component\HttpFoundation\Request;

$app = new CmsApplication($config);
$app->register(new CapsuleServiceProvider(), [
    'capsule.connections' => $app['capsule.connections'],
    'capsule.options' => $app['capsule.options'],
]);
$app->register(new SentryServiceProvider(), [
    SentryServiceProvider::SENTRY_OPTIONS => $app[SentryServiceProvider::SENTRY_OPTIONS]
]);

// use twig asset package
$app->extend('twig', function (\Twig_Environment $twig) use ($app) {
    $twig->addFunction(new \Twig_Function('asset', function ($asset_name) use ($app) {
        $project_root = __DIR__ . '/..';
        $asset_manifest_path = $project_root . $app['asset_manifest_path'];
        $version_strategy = new WebpackManifestVersionStrategy($asset_manifest_path);

        $asset_package = new PathPackage($app['asset_public_path'], $version_strategy);
        return $asset_package->getUrl($asset_name);
    }));

    return $twig;
});

// decode json content to array
$app->before(function (Request $request) {
    if ($request->getContentType() === 'json') {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : []);
    }
});

return $app;
