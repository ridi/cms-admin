<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Lib;

use Symfony\Component\Asset\VersionStrategy\VersionStrategyInterface;

class WebpackManifestVersionStrategy implements VersionStrategyInterface
{
    private $manifest_path;
    private $hashes;

    public function __construct(string $manifest_path)
    {
        $this->manifest_path = $manifest_path;
    }

    public function getVersion($path): string
    {
        if (!is_array($this->hashes)) {
            $manifest_json = json_decode(file_get_contents($this->manifest_path), true);
            $this->hashes = $manifest_json;
        }

        return isset($this->hashes[$path]) ? $this->hashes[$path] : $path;
    }

    public function applyVersion($path): string
    {
        if ($path[0] === '/') {
            $path = '/' . $path;
        }

        return $this->getVersion($path);
    }
}
