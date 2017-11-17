<?php

$capsule = new Illuminate\Database\Capsule\Manager();
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['MYSQL_HOST'],
    'database' => $_ENV['MYSQL_DATABASE'],
    'username' => $_ENV['MYSQL_USER'],
    'password' => $_ENV['MYSQL_PASSWORD'],
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix' => '',
    'options' => [
        // mysqlnd 5.0.12-dev - 20150407 에서 PDO->prepare 가 매우 느린 현상
        PDO::ATTR_EMULATE_PREPARES => true
    ]
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();
