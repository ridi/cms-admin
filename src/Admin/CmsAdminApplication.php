<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin;

use Moriony\Silex\Provider\SentryServiceProvider;
use Ridibooks\Cms\Admin\Controller\AdminLoginControllerProvider as AdminLoginController;
use Ridibooks\Cms\Admin\Controller\LogControllerProvider as AdminLogController;
use Ridibooks\Cms\Admin\Controller\MenuControllerProvider as AdminMenuController;
use Ridibooks\Cms\Admin\Controller\TagControllerProvider as AdminTagController;
use Ridibooks\Cms\Admin\Controller\UserControllerProvider as AdminUserController;
use Ridibooks\Cms\CmsApplication;
use Symfony\Component\Asset\PathPackage;

class CmsAdminApplication extends CmsApplication
{
    public function __construct(array $values = [])
    {
        parent::__construct($values);

        $this->registerSentryServiceProvider();
        $this->extendTwigServiceProvider();

        $this->before(AdminRouter::authorize());

        $this->mount('/', new AdminUserController());
        $this->mount('/', new AdminTagController());
        $this->mount('/', new AdminMenuController());
        $this->mount('/', new AdminLogController());
        $this->mount('/', new AdminLoginController());
    }

    private function extendTwigServiceProvider()
    {
        // use twig asset package
        $this->extend('twig', function (\Twig_Environment $twig) {
            $version_strategy = new WebpackManifestVersionStrategy($this['asset_manifest_path']);
            $asset_package = new PathPackage($this['asset_public_path'], $version_strategy);
            $twig->addFunction(new \Twig_Function('asset', function ($asset_name) use ($asset_package) {
                return $asset_package->getUrl($asset_name);
            }));

            return $twig;
        });
    }

    private function registerSentryServiceProvider()
    {
        $sentry_dsn = $this['sentry_key'];
        if (isset($sentry_dsn) && $sentry_dsn !== '') {
            $this->register(new SentryServiceProvider(), [
                SentryServiceProvider::SENTRY_OPTIONS => [
                    SentryServiceProvider::OPT_DSN => $sentry_dsn,
                ]
            ]);

            $client = $this[SentryServiceProvider::SENTRY];
            $client->install();
        }
    }
}
