.PHONY: all dev server client clean docker-run

all: server client

dev:
	composer install
	make -C client

server:
	composer install --no-dev --optimize-autoloader

client:
	make -C client

init-db:
	bin/setup.sh

clean:
	rm -rf vendor
	rm -rf web/static

docker-up:
	docker run -itd \
		--name cms-admin \
		--env-file .env \
		-p 80:80 \
		-v $(shell pwd):/var/www/html \
		ridibooks/cms-admin:latest

docker-down:
	docker stop cms-admin && docker rm cms-admin
