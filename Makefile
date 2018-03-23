.PHONY: all server client clean docker-run

all: server client

server:
	composer install --no-dev --optimize-autoloader

client:
	make -C client

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
