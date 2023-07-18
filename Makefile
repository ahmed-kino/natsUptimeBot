VERSION ?= ${newrev}
NAME ?= nats_uptime_bot
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

format:
	find . -type f -name \*.py | xargs black --skip-string-normalization

fmt: format

clean:
	rm -rf */migrations
	./manage.py reset_db --noinput --close-sessions

init:
	./manage.py makemigrations
	./manage.py migrate


test:
	./manage.py test
