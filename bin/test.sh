#!/usr/bin/env bash

# Set up
vendor/bin/phinx migrate -e local
vendor/bin/phinx seed:run -e local

# Run PHPUnit
echo 'test is not specified.'

