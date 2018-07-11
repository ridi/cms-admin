<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Test\Service;

use PHPUnit\Framework\TestCase;
use Ridibooks\Cms\Admin\Service\GroupService;
use Ridibooks\Cms\Admin\Service\UserService;

class GroupServiceTest extends TestCase
{
    public static function setUpBeforeClass()
    {
        system('/bin/bash ./bin/setup.sh');
    }

    public function testGetGroups()
    {
        $this->assertEquals(
            ['my_team'], 
            GroupService::getGroups('name')
        );
    }

    public function testInsertAndDeleteGroup()
    {
        GroupService::insertGroup(['name' => 'new_team']);

        // Find the new group
        $new_group = reset(array_filter(GroupService::getGroups(), function($group) {
            return $group['name'] == 'new_team';
        }));
        $this->assertNotNull($new_group);

        GroupService::deleteGroup($new_group['id']);
    }

    public function testUpdateGroup()
    {
        GroupService::updateGroup(1, 'renamed', true);

        $this->assertEquals(['renamed'], GroupService::getGroups('name'));

        GroupService::updateGroup(1, 'my_team', true);
    }

    public function testGetGroupUsers()
    {
        $this->assertEquals(['admin'], GroupService::getUsers(1));
    }

    public function testInsertAndDeletUser()
    {
        UserService::insertAdminUser([
            'id' => 'tester',
            'passwd' => 'test',
            'is_use' => true,
            'name' => 'test',
            'team' => 'test',
        ]);

        GroupService::insertUser(1, 'tester');
        $this->assertEquals(['admin', 'tester'], GroupService::getUsers(1));

        GroupService::deleteUser(1, 'tester');
        $this->assertEquals(['admin'], GroupService::getUsers(1));

        UserService::deleteUser('tester');
    }
}
