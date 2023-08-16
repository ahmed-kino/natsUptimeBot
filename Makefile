VERSION ?= ${newrev}
NAME ?= nats_uptime_bot
PGUSER ?= ${NAME}
PGPASSWORD ?= admin
FULL_NAME = ${NAME}:${VERSION}
DOCKER_REGISTRY = neox1993


.EXPORT_ALL_VARIABLES:

.PHONY: build
build:
	docker build \
	--tag=${DOCKER_REGISTRY}/${NAME}:latest \
	-f Dockerfile.prod .

.PHONY: run
run:
	docker run -p 8000:8000 ${DOCKER_REGISTRY}/${NAME}:latest 

.PHONY: push
push:
	docker push ${DOCKER_REGISTRY}/${NAME}:latest

.PHONY: build-ui
build-ui:
	docker build \
	--tag=${DOCKER_REGISTRY}/${NAME}_ui:latest  -f ui/Dockerfile.prod ui/

.PHONY: run-ui
run-ui:
	docker run -p 3000:3000 ${DOCKER_REGISTRY}_ui/${NAME}:latest 

.PHONY: push-ui
push-ui:
	docker push ${DOCKER_REGISTRY}/${NAME}_ui:latest

fmt: format sort

sort:
	find . -type f -name \*.py | xargs isort

format:
	find . -type f -name \*.py | xargs black --skip-string-normalization

clean:
	rm -rf */migrations
	./manage.py reset_db --noinput --close-sessions

init:
	./manage.py makemigrations
	./manage.py migrate

test:
	./manage.py test

compose:
	docker compose up

shell:
	docker compose exec nats_uptime_bot sh

db:
	docker compose exec postgres sh -c "PGPASSWORD=${PGPASSWORD} psql -U${PGUSER} -d ${NAME}"
