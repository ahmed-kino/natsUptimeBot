FROM python:3.9.17-alpine


RUN apk update

WORKDIR /code

COPY . /code/

RUN pip install -r requirements.txt
