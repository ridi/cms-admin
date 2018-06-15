<?php

use Phinx\Migration\AbstractMigration;

class AddTagDisplayNameColumn extends AbstractMigration
{
    public function change()
    {
        $this->table('tb_admin2_tag')
            ->addColumn('display_name', 'string', ['length' => 32, 'after' => 'name', 'collation' => 'utf8_unicode_ci'])
            ->addIndex(['name'], [ 'unique' => true ])
            ->update();
    }
}
