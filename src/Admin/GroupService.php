<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin;

use Ridibooks\Cms\Admin\Model\AdminGroup;
use Ridibooks\Cms\Auth\LoginService;

class GroupService
{
    public function getGroups(?string $column = null): array
    {
        if (isset($column)) {
            return AdminGroup::pluck($column)->all();
        } else {
            return AdminGroup::all()->toArray();
        }
    }

    public function getGroup(int $group_id): array
    {
        return AdminGroup::find($group_id)->toArray();
    }

    public function insertGroup(array $group)
    {
        if (empty($group['name'])) {
            throw new \InvalidArgumentException();
        }

        if (empty($group['creator'])) {
            $group['creator'] = LoginService::GetAdminID();
            error_log(var_export($group['creator'], true));
        }

        if (empty($group['is_use'])) {
            $group['is_use'] = true;
        }

        $new_group = new AdminGroup($group);

        return $new_group->save();
    }

    public function updateGroup(int $id, string $name, bool $is_use)
    {
        if (!$is_use) {
            $user_count = AdminGroup::find($id)->users()->count();
            if ($user_count > 0) {
                throw new \Exception('해당 그룹을 사용하고 있는 유저가 있습니다. 사용중인 유저: ' . $user_count);
            }
        }

        /** @var AdminGroup $group */
        $group= AdminGroup::find($id);
        $group->name = $name;
        $group->is_use = $is_use;
        $group->save();
    }

    public function deleteGroup(int $group_id)
    {
        AdminGroup::destroy($group_id);
    }

    public function getUsers(int $group_id)
    {
        return AdminGroup::find($group_id)->users->pluck('id')->all();
    }

    public function insertUser(int $group_id, string $user_id)
    {
        $group = AdminGroup::find($group_id);
        $group->users()->attach($user_id);
    }

    public function deleteUser(int $group_id, string $user_id)
    {
        $group = AdminGroup::find($group_id);
        $group->users()->detach($user_id);
    }

    public function getTags(int $group_id)
    {
        return AdminGroup::find($group_id)->tags->pluck('id')->all();
    }

    public function insertTags(int $group_id, string $tag_id)
    {
        $group = AdminGroup::find($group_id);
        $group->tags()->attach($tag_id);
    }

    public function deleteTag(int $group_id, string $tag_id)
    {
        $group = AdminGroup::find($group_id);
        $group->tags()->detach($tag_id);
    }
}
