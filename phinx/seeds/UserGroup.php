<?php 
declare(strict_types=1); 
 
use Phinx\Seed\AbstractSeed; 
 
class UserGroup extends AbstractSeed 
{ 
    public function run() 
    { 
        $data = [ 
            [ 
                'name' => 'my_team', 
                'is_use' => 1, 
                'creator' => 'admin', 
            ], 
        ]; 
 
        $posts = $this->table('tb_admin2_user_group'); 
        $posts->insert($data)->save(); 
    } 
} 
