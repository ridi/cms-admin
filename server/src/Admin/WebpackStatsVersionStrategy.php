<?php
declare(strict_types=1);

namespace Ridibooks\Platform\Cms\Admin;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class WebpackStatsVersionStrategy implements VersionStrategyInterface
{
    private $stats_path;
    private $hashes;

    public function __construct(string $stats_path)
    {
        $this->stats_path = $stats_path;
    }

    public function getVersion($path): string
    {
        if (!is_array($this->hashes)) {
            $stats_json = json_decode(file_get_contents($this->stats_path), true);
            $this->hashes = $stats_json['assetsByChunkName'];
        }

        return isset($this->hashes[$path]) ? $this->hashes[$path] : $path;
    }

    public function applyVersion($path): string
    {
        if ($path[0]==='/') {
            $path = '/'.$path;
        }

        return $this->getVersion($path);
    }
}
