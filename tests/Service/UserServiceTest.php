<?php
declare(strict_types=1);

namespace Ridibooks\Cms\Admin\Test\Service;

use PHPUnit\Framework\TestCase;
use Ridibooks\Cms\Admin\Service\GroupService;
use Ridibooks\Cms\Admin\Service\UserService;

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
