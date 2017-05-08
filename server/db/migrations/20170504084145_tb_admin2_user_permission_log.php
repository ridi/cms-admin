<?php

use Phinx\Migration\AbstractMigration;

class TbAdmin2UserPermissionLog extends AbstractMigration
{
    public function change()
    {
        $this->table('tb_admin2_user_permission_log')
            ->addColumn('user_id', 'string', ['limit' => 32, 'null' => false, 'collation' => 'utf8_unicode_ci',
                'comment' => '계정 ID'])
            ->addColumn('menu_ids', 'text', ['null' => true,
                'comment' => '메뉴 id의 문자열 목록'])
            ->addColumn('tag_ids', 'text', ['null' => true,
                'comment' => '태그 id의 문자열 목록'])
            ->addColumn('edited_by', 'string', ['limit' => 32, 'null' => false,
                'comment' => '수정한 사람의 ID'])
            ->addColumn('created_at', 'datetime', ['default' => 'CURRENT_TIMESTAMP',
                'comment' => '등록일'])
            ->addForeignKey('user_id', 'tb_admin2_user', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->create();
    }
}
