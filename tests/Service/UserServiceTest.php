<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin;

use PHPUnit\Framework\TestCase;

class UserServiceTest extends TestCase
{
    public function testGetTagsInheritedFromGroups()
    {
        $this->assertEquals(
            [1],
            UserService::getAdminGroups('admin')
        );

        $this->assertEquals(
            [2],
            GroupService::getTags(1)
        );

        $this->assertEquals(
            [1],
            UserService::getAdminUserTag('admin')
        );

        $this->assertEquals(
            [2],
            UserService::getTagsInheritedFromGroups('admin')
        );
    }
}
