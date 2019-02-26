.PHONY: all dev clean up down log

all: dev up 

dev:
	virtualenv venv --python=python3.7

clean:
	rm -rf venv

up:
	docker-compose up -d

down:
	docker-compose stop

log:
	docker-compose logs -f
