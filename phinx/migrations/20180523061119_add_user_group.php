<?php

use Phinx\Migration\AbstractMigration;

class AddUserGroup extends AbstractMigration
{
    public function change()
    {
        $this->table('tb_admin2_user_group')
            ->addColumn('name', 'string', ['length' => 32])
            ->addColumn('is_use', 'boolean')
            ->addColumn('creator', 'string', ['length' => 32])
            ->addTimestamps()
            ->create();

        $this->table('tb_admin2_user_group_users')
            ->addColumn('group_id', 'integer')
            ->addColumn('user_id', 'string', ['length' => 32])
            ->addForeignKey('group_id', 'tb_admin2_user_group', 'id') 
            ->addForeignKey('user_id', 'tb_admin2_user', 'id') 
            ->addIndex('user_id')
            ->create();
    }
}
