<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Test\Model;

use PHPUnit\Framework\TestCase;
use Ridibooks\Cms\Admin\Model\AdminGroup;
use Ridibooks\Cms\Admin\Model\AdminUser;
use Ridibooks\Cms\Admin\Model\AdminTag;

class GroupModelTest extends TestCase
{
    public function testGetGroups()
    {
        $groups = AdminGroup::find(1)->pluck('name')->all();

        $this->assertEquals(['my_team'], $groups);
    }

    public function testGetUsersFromGroup()
    {
        $users = AdminGroup::find(1)->users->pluck('name')->all();

        $this->assertEquals(['관리자'], $users);
    }

    public function testGetGroupsFromTag()
    {
        $groups = AdminTag::find(2)->groups->pluck('name')->all();

        $this->assertEquals(['my_team'], $groups);
    }

    public function testGetGroupsFromUser()
    {
        $groups = AdminUser::find('admin')->groups->pluck('name')->all();

        $this->assertEquals(['my_team'], $groups);
    }

    public function testGetTagGroupJoined()
    {
        $direct_tags = AdminUser::find('admin')->tags->pluck('name')->all();
        $tags = AdminUser::find('admin')->tags_group_joined->pluck('name')->all();

        $this->assertEquals(['권한 관리'], $direct_tags);
        $this->assertEquals(['권한 관리', '테스트'], $tags);
    }
}
