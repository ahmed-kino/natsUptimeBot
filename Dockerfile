FROM python:3.9.17-alpine

ENV PYTHONUNBUFFERED 1

RUN apk update && apk add libpq-dev make

WORKDIR /code

COPY . /code/

RUN pip install -r requirements.txt


RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]