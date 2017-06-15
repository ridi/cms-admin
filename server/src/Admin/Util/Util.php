<?php
declare(strict_types=1);

namespace Ridibooks\Platform\Cms\Admin\Util;

class Util
{
    public static function getAssetName(string $chunk_name): string
    {
        $webpack_stats = self::getWebpackStats();
        $asset_names = $webpack_stats['assetsByChunkName'];
        return $asset_names[$chunk_name];
    }

    public static function getWebpackStats(): array
    {
        $stat_content = file_get_contents(__DIR__ . "/../../../../client/dist/stats.json");
        return json_decode($stat_content, true);
    }
}
