<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin;

use Ridibooks\Cms\Auth\LoginService;
use Ridibooks\Cms\CmsApplication;
use Symfony\Component\HttpFoundation\Request;

class AdminRouter
{
    public static function authorize()
    {
        return function (Request $request, CmsApplication $app) {
            $login_url = '/super/login';
            if (strncmp($request->getRequestUri(), $login_url, strlen($login_url)) === 0) {
                return null;
            }

            if (empty($_SESSION['admin-id'])) {
                $request_uri = $request->getRequestUri();
                if (!empty($request_uri) && $request_uri != '/super/login' && $request_uri != '/super/logout') {
                    $login_url .= '?return_url=' . urlencode($request_uri);
                }

                return $app->redirect($login_url);
            }

            LoginService::setLoginContext([
                'user_id' => $_SESSION['admin-id'],
            ]);

            return null;
        };
    }
}
