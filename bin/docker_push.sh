#!/usr/bin/env bash
set -e

DOCKER_TAG=${TRAVIS_TAG:-latest}
COMMIT=${TRAVIS_COMMIT::8}

docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
docker build -t ridibooks/cms-admin:${COMMIT} .

echo "Pushing ridibooks/cms-admin"
docker tag ridibooks/cms-admin:${COMMIT} ridibooks/cms-admin:${DOCKER_TAG}
docker push ridibooks/cms-admin
echo "Pushed ridibooks/cms-admin"
