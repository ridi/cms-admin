<?php
namespace Ridibooks\Platform\Cms\Admin;

use Illuminate\Database\Capsule\Manager as DB;
use Ridibooks\Platform\Cms\Admin\Dto\AdminUserDto;
use Ridibooks\Platform\Cms\Admin\Model\AdminUser;
use Ridibooks\Platform\Cms\Auth\PasswordService;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

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

    public static function getAdminUserMenu($user_id)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            return [];
        }

        return $user->menus->pluck('id')->all();
    }

    public static function insertAdminUser($adminUserDto)
    {
        self::_validateAdminUserInsert($adminUserDto);

        // password encrypt
        $adminUserDto->passwd = PasswordService::getPasswordAsHashed($adminUserDto->passwd);
        AdminUser::create((array)$adminUserDto);
    }

    public static function updateUserInfo(AdminUserDto $adminUserDto)
    {
        if (isset($adminUserDto->new_passwd) && $adminUserDto->new_passwd !== '') {
            if ($adminUserDto->new_passwd != $adminUserDto->chk_passwd) {
                throw new \Exception('변경할 비밀번호가 일치하지 않습니다.');
            }
            $adminUserDto->passwd = $adminUserDto->new_passwd;
        }

        self::_validateAdminUserUpdate($adminUserDto);

        $filler = [
            'name' => $adminUserDto->name,
            'team' => $adminUserDto->team,
            'is_use' => $adminUserDto->is_use
        ];

        if (isset($adminUserDto->passwd) && trim($adminUserDto->passwd) !== '') {
            $filler['passwd'] = PasswordService::getPasswordAsHashed($adminUserDto->passwd);
        }

        /** @var AdminUser $admin */
        $admin = AdminUser::find(trim($adminUserDto->id));
        $admin->fill($filler);
        $admin->save();
    }

    public static function deleteUser($user_id)
    {
        AdminUser::destroy($user_id);
    }

    public static function updateUserPermissions($user_id, $tag_ids, $menu_ids)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            throw new ResourceNotFoundException();
        }

        DB::connection()->transaction(function () use ($user, $tag_ids, $menu_ids) {
            $user->tags()->sync($tag_ids);
            $user->menus()->sync($menu_ids);
        });
    }

    /**Admin 계정 insert validator
     * @param AdminUserDto $adminUserDto
     */
    private static function _validateAdminUserInsert($adminUserDto)
    {
        if (!isset($adminUserDto->id) || $adminUserDto->id === '') {
            throw new \Exception('계정 ID를 입력하여 주십시오.');
        }

        if (!isset($adminUserDto->passwd) || $adminUserDto->passwd === '') {
            throw new \Exception('계정 비밀번호를 입력하여 주십시오.');
        }

        self::_validateAdminUserUpdate($adminUserDto);
    }

    /**Admin 계정 update validator
     * @param AdminUserDto $adminUserDto
     */
    private static function _validateAdminUserUpdate($adminUserDto)
    {
        if (!isset($adminUserDto->id) || $adminUserDto->id === '') {
            throw new \Exception('계정ID를 입력하여 주십시오.');
        }

        if (!isset($adminUserDto->name) || $adminUserDto->name === '') {
            throw new \Exception('이름을 입력하여 주십시오.');
        }

        if (!isset($adminUserDto->team) || $adminUserDto->team === '') {
            throw new \Exception('팀을 입력하여 주십시오.');
        }

        if (!isset($adminUserDto->is_use) || $adminUserDto->is_use === '') {
            throw new \Exception('사용 여부를 입력하여 주십시오.');
        }
    }
}
