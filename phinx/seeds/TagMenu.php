<?php
declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

class TagMenu extends AbstractSeed
{
    public function run()
    {
        $data = [
            [
                'tag_id' => 1,
                'menu_id' => 2,
            ],
            [
                'tag_id' => 1,
                'menu_id' => 3,
            ],
            [
                'tag_id' => 1,
                'menu_id' => 4,
            ],[
                'tag_id' => 1,
                'menu_id' => 5,
            ],
        ];

        $posts = $this->table('tb_admin2_tag_menu');
        $posts->insert($data)->save();
    }
}
