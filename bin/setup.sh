#!/usr/bin/env bash

set -e

mysql -uroot -e 'CREATE DATABASE IF NOT EXISTS cms;'

vendor/bin/phinx migrate -e local
vendor/bin/phinx seed:run -s User -s Menu -s Tag -s TagMenu -s UserTag -e local
