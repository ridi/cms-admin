#!/usr/bin/env bash

set -e

APACHE_CONFIG_FILE=/etc/apache2/sites-available/cms-admin.conf

# Replace each placeholder to env variable
sed -i "s|{{APACHE_DOC_ROOT}}|${APACHE_DOC_ROOT}|g" ${APACHE_CONFIG_FILE}
sed -i "s|{{APACHE_ALIAS}}|${APACHE_ALIAS}|g" ${APACHE_CONFIG_FILE}
sed -i "s|{{CMS_RPC_URL}}|${CMS_RPC_URL}|g" ${APACHE_CONFIG_FILE}

exec /docker-entrypoint.sh "$@"
