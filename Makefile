VERSION ?= ${newrev}
NAME ?= nats_uptime_bot
PGUSER ?= ${NAME}
PGPASSWORD ?= admin
FULL_NAME = ${NAME}:${VERSION}


.EXPORT_ALL_VARIABLES:

.PHONY: build
build:
	docker build \
	--tag=${NAME}:latest \
	.

# Will use this later
.PHONY: push
push:
	docker push ${NAME}:latest

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
