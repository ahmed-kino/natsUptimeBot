
VERSION ?= ${newrev}
NAME ?= probe
DOCKER_REGISTRY = neox1993


.EXPORT_ALL_VARIABLES:

.PHONY: build
build:
	docker build \
	--tag=${DOCKER_REGISTRY}/${NAME}:latest .

.PHONY: push
push:
	docker push ${DOCKER_REGISTRY}/${NAME}:latest