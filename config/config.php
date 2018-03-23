<?php

use Moriony\Silex\Provider\SentryServiceProvider;

$const = json_decode(file_get_contents(__DIR__ . '/const.json'), true);

$config = [
    'debug' => $_ENV['DEBUG'],
    'capsule.connections' => [
        'default' => [
            'driver' => 'mysql',
            'host' => $_ENV['MYSQL_HOST'] ?? 'localhost',
            'database' => $_ENV['MYSQL_DATABASE'] ?? 'cms',
            'username' => $_ENV['MYSQL_USER'] ?? 'root',
            'password' => $_ENV['MYSQL_PASSWORD'] ?? '',
            'charset' => 'utf8',
            'collation' => 'utf8_unicode_ci',
        ]
    ],
    'capsule.options' => [
        'setAsGlobal' => true,
        'bootEloquent' => true,
        'enableQueryLog' => false,
    ],
    SentryServiceProvider::SENTRY_OPTIONS => [
        SentryServiceProvider::OPT_DSN => $_ENV['SENTRY_KEY'] ?? ''
    ],
    'asset_manifest_path' => $const['WEBPACK_OUTPUT_DIR'] . '/' . $const['ASSET_MANIFEST_FILENAME'],
    'asset_public_path' => $const['ASSET_PUBLIC_PATH'],
    'twig.globals' => [
        'STATIC_URL' => $const['CMS_STATIC_URL'],
        'BOWER_PATH' => $const['CMS_BOWER_PATH'],
    ],
    'twig.path' => [
        __DIR__ . '/../views'
    ],
];

return $config;
