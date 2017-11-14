<?php

use Phinx\Seed\AbstractSeed;

class Menu extends AbstractSeed
{
    public function run()
    {
        $data = [
            [
                'menu_title' => '예제',
                'menu_url' => '#',
                'menu_order' => 0,
                'menu_deep' => 0,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '메뉴',
                'menu_url' => '/example/php/home',
                'menu_order' => 1,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '링크1',
                'menu_url' => '/example/php/resource1',
                'menu_order' => 2,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '링크2',
                'menu_url' => '/example/php/resource2',
                'menu_order' => 3,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => 'CMS 관리 - 퍼포먼스팀',
                'menu_url' => '#',
                'menu_order' => 4,
                'menu_deep' => 0,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '어드민유저 관리',
                'menu_url' => '/super/users',
                'menu_order' => 5,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '권한 태그 관리',
                'menu_url' => '/super/tags',
                'menu_order' => 6,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '메뉴 관리',
                'menu_url' => '/super/menus',
                'menu_order' => 7,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
            [
                'menu_title' => '변경 이력',
                'menu_url' => '/super/logs',
                'menu_order' => 8,
                'menu_deep' => 1,
                'is_use' => 1,
                'is_show' => 1,
                'is_newtab' => 0,
                'reg_date' => date('Y-m-d H:i:s'),
            ],
        ];

        $posts = $this->table('tb_admin2_menu');
        $posts->insert($data)->save();
    }
}
