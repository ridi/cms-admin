<?php
namespace Ridibooks\Platform\Cms\Admin;

use Illuminate\Database\Capsule\Manager as DB;
use Ridibooks\Platform\Cms\Admin\Model\AdminUser;
use Ridibooks\Platform\Cms\Admin\Model\AdminUserPermissionLog;
use Ridibooks\Platform\Cms\Auth\LoginService;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class LogService
{
    public static function getUserPermissions($page_index, $row_per_page)
    {
        return AdminUserPermissionLog::skip(($page_index - 1) * $row_per_page)->take($row_per_page)->get();
    }

    public static function updateUserPermissions($user_id, $tag_ids, $menu_ids)
    {
        /** @var AdminUser $user */
        $user = AdminUser::find($user_id);
        if (!$user) {
            throw new ResourceNotFoundException();
        }

        $new_log = new AdminUserPermissionLog();
        $new_log->fill([
            'user_id' => $user_id,
            'tag_ids' => implode(",", array_map('strval', $tag_ids)),
            'menu_ids' => implode(",", array_map('strval', $menu_ids)),
            'edited_by' => LoginService::GetAdminID(),
        ]);

        DB::connection()->transaction(function () use ($user, $tag_ids, $menu_ids, $new_log) {
            $user->tags()->sync($tag_ids);
            $user->menus()->sync($menu_ids);
            $new_log->save();
        });
    }
}
