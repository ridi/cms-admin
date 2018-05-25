<?php
namespace Ridibooks\Cms\Admin;

use Ridibooks\Cms\Admin\Model\AdminUser;
use Ridibooks\Cms\Auth\PasswordService;

class UserService
{
    public static function getAdminUserCount($search_text)
    {
        return AdminUser::query()
            ->where('id', 'like', '%' . $search_text . '%')
            ->orWhere('name', 'like', '%' . $search_text . '%')
            ->count();
    }

    public static function getAdminUserList($search_text, $offset, $limit)
    {
        return AdminUser::query()
            ->where('id', 'like', '%' . $search_text . '%')
            ->orWhere('name', 'like', '%' . $search_text . '%')
            ->orderBy('is_use', 'desc')
            ->orderBy('id')
            ->skip($offset)->take($limit)
            ->get();
    }

    public static function getUser($id)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($id);
        if (!$user) {
            return null;
        }
        return $user->toArray();
    }

    public static function getAdminUserTag($user_id)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            return [];
        }

        return $user->tags->pluck('id')->all();
    }

    public static function getAllTags($user_id)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            return [];
        }

        return $user->tags_via_group->pluck('id')->all();
    }

    public static function getAdminUserMenu($user_id)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            return [];
        }

        return $user->menus->pluck('id')->all();
    }

    public static function insertAdminUser(array $adminUser)
    {
        self::_validateAdminUserInsert($adminUser);

        // password encrypt
        $adminUser['passwd'] = PasswordService::getPasswordAsHashed($adminUser['passwd']);
        AdminUser::create($adminUser);
    }

    public static function updateUserInfo(array $adminUser)
    {
        if (isset($adminUser['new_passwd']) && $adminUser['new_passwd'] !== '') {
            if ($adminUser['new_passwd'] != $adminUser['chk_passwd']) {
                throw new \Exception('변경할 비밀번호가 일치하지 않습니다.');
            }
            $adminUser['passwd'] = $adminUser['new_passwd'];
        }

        self::_validateAdminUserUpdate($adminUser);

        $filler = [
            'name' => $adminUser['name'],
            'team' => $adminUser['team'],
            'is_use' => $adminUser['is_use']
        ];

        if (isset($adminUser['passwd']) && trim($adminUser['passwd']) !== '') {
            $filler['passwd'] = PasswordService::getPasswordAsHashed($adminUser['passwd']);
        }

        /** @var AdminUser $admin */
        $admin = AdminUser::find(trim($adminUser['id']));
        $admin->fill($filler);
        $admin->save();
    }

    public static function deleteUser($user_id)
    {
        AdminUser::destroy($user_id);
    }

    /**Admin 계정 insert validator
     */
    private static function _validateAdminUserInsert(array $adminUser)
    {
        if (!isset($adminUser['id']) || $adminUser['id'] === '') {
            throw new \Exception('계정 ID를 입력하여 주십시오.');
        }

        if (!isset($adminUser['passwd']) || $adminUser['passwd'] === '') {
            throw new \Exception('계정 비밀번호를 입력하여 주십시오.');
        }

        self::_validateAdminUserUpdate($adminUser);
    }

    /**Admin 계정 update validator
     */
    private static function _validateAdminUserUpdate(array $adminUser)
    {
        if (!isset($adminUser['id']) || $adminUser['id'] === '') {
            throw new \Exception('계정ID를 입력하여 주십시오.');
        }

        if (!isset($adminUser['name']) || $adminUser['name'] === '') {
            throw new \Exception('이름을 입력하여 주십시오.');
        }

        if (!isset($adminUser['team']) || $adminUser['team'] === '') {
            throw new \Exception('팀을 입력하여 주십시오.');
        }

        if (!isset($adminUser['is_use']) || $adminUser['is_use'] === '') {
            throw new \Exception('사용 여부를 입력하여 주십시오.');
        }
    }
}
