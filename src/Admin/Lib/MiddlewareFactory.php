<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Lib;

use Ridibooks\Cms\MiniRouter;
use Symfony\Component\HttpFoundation\Request;

class MiddlewareFactory
{
    public static function authRequired(): callable
    {
        return function (Request $request) {
            return MiniRouter::shouldRedirectForLogin($request);
        };
    }
}
