#!/usr/bin/env bash
set -e

DOCKER_TAG=${TRAVIS_TAG:-latest}
DEFAULT_TAG=$(git rev-parse --short HEAD) # commit hash

docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}

echo "Bulilding ridibooks/cms-admin..."
docker build -t ridibooks/cms-admin:${DEFAULT_TAG} .
echo "Builded ridibooks/cms-admin"

echo "Pushing ridibooks/cms-admin"
docker tag ridibooks/cms-admin:${DEFAULT_TAG} ridibooks/cms-admin:${DOCKER_TAG}
docker push ridibooks/cms-admin
echo "Pushed ridibooks/cms-admin"
