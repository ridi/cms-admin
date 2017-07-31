#!/bin/sh

if [ -f "/var/cms-admin/.env" ]
then
  echo ".env found."
  cp /var/cms-admin/.env /var/www/html/.env
else
	echo ".env not found."
fi

exec apache2-foreground "$@"

