<?php
declare(strict_types=1);

use JG\Silex\Provider\CapsuleServiceProvider;
use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Admin\WebpackManifestVersionStrategy;
use Ridibooks\Cms\CmsApplication;
use Symfony\Component\Asset\PathPackage;

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
    $version_strategy = new WebpackManifestVersionStrategy($app['asset_manifest_path']);
    $asset_package = new PathPackage($app['asset_public_path'], $version_strategy);
    $twig->addFunction(new \Twig_Function('asset', function ($asset_name) use ($asset_package) {
        return $asset_package->getUrl($asset_name);
    }));

    return $twig;
});

return $app;
