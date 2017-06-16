<?php
declare(strict_types=1);

namespace Ridibooks\Platform\Cms\Admin\Util;

use Symfony\Component\Asset\PathPackage;

class Util
{
    public static function getVersionedAssetUrl(string $asset_name): string
    {
        $version_strategy = new WebpackStatsVersionStrategy(__DIR__ . '/../../../../client/dist/stats.json');
        $file_hash_package = new PathPackage('/super/client/dist/', $version_strategy);
        return $file_hash_package->getUrl($asset_name);
    }
}
