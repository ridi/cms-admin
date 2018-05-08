<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Model;

use PHPUnit\Framework\TestCase;

class UserGroupModelTest extends TestCase
{
    public function testGetUserGroups()
    {
        $groups = AdminUserGroup::find(1)->pluck('name')->all();

        $this->assertEquals(['my_team'], $groups);
    }

    public function testGetUsersFromUserGroup()
    {
        $users = AdminUserGroup::find(1)->users->pluck('name')->all();

        $this->assertEquals(['관리자'], $users);
    }
}
