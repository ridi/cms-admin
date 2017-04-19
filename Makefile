.PHONY: all server client

all: server client

server:
	composer install --no-dev --optimize-autoloader

client:
	@cd client && npm install && npm run build
