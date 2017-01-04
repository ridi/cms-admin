.PHONY: all server client

all: server client

server:
	composer update --no-dev --optimize-autoloader

client:
	@cd client && npm install && npm run build
