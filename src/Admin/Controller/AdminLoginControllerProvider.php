<?php

namespace Ridibooks\Cms\Admin\Controller;

use Ridibooks\Cms\Admin\UserService;
use Ridibooks\Cms\CmsApplication;
use Ridibooks\Cms\Util\UrlHelper;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class AdminLoginControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controller_collection = $app['controllers_factory'];

        $controller_collection->get('/login', [$this, 'getLoginPage']);
        $controller_collection->post('/login', [$this, 'login']);
        $controller_collection->get('/logout', [$this, 'logout']);

        return $controller_collection;
    }

    public function getLoginPage(Request $request, CmsApplication $app)
    {
        return $app->render('login.twig');
    }

    public function login(Request $request, Application $app)
    {
        $user_id = $request->get('id');
        $user_passwd = $request->get('passwd');
        $return_url = $request->get('return_url', '/super/users');

        try {
            $user = UserService::getUser($user_id);
            if (!$user || !$user['id'] || !$user['passwd'] ||
                !password_verify($user_passwd, $user['passwd'])
            ) {
                throw new \Exception('계정 인증에 실패했습니다.');
            }

            if ($user['is_use'] != '1') {
                throw new \Exception('사용이 금지된 계정입니다. 관리자에게 문의하세요.');
            }

            $_SESSION['admin-id'] = $user['id'];

            $response = RedirectResponse::create($return_url);
        } catch (\Exception $e) {
            return UrlHelper::printAlertRedirect($return_url, $e->getMessage());
        }

        $response->headers->clearCookie('return_url');
        return $response;
    }

    public function logout()
    {
        $response = RedirectResponse::create('/super/login');
        session_destroy();
        return $response;
    }
}
