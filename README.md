# NATS UPTIME BOT

This is a demo django app to view how we're laying out the model for NATS UPTIME BOT

## Model

the model's architecture looks like the following

```python
from django.db import models
from django.contrib.postgres.fields import JSONField


class Target(models.Model):
    domain_name = models.CharField(max_length=255)


class Check(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    data = JSONField()

class Result(models.Model):
    check = models.ForeignKey(Check, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    data = JSONField()
```

## Run: DEV

### Prerequisites
1. make sure you have `docker` and `docker compose` installed. [Installation Guid](https://docs.docker.com/engine/install/)
2. make sure you have `cmake` installed. [Installation Guid](https://www.gnu.org/software/make/)

### Running the API

* clone the repo `$ git clone git@github.com:ahmed-kino/natsUptimeBot.git`

* change directory to the repo `$ cd natsUptimeBot`

* copy the env example to a new file `$ cp .envrc.example .envrc`

* Then run `$ make compose` to run the server

### Run migrations

* Run `$ make shell` to execute into the container

* Run migration `$ make init`

## Format

* Run `make shell` to execute into the container
* Run format `make format`

## Reset DB:

* Run `make shell` to execute into the container
* Run `make clean` to reset the database **NOTE that this command will remove `*/migrations` directories from the code**


## Adding data with DRF:

1. if you want to add data to the target run the following command:
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{
        "domain_name": "first_domain"
    }' http://127.0.0.1:8000/api/targets/
    ```

2. if you want to add data to the checks run the following command:
   ```sh
   curl -X POST -H "Content-Type: application/json" -d '{
       "target": {
           "domain_name": "first_domain"
       },
       "name": "http",
       "data": {
         "http_method": "GET",
         "status_code": 200,
         "port": 443,
         "headers": {"auth": "some token"}
       }
   }' http://127.0.0.1:8000/api/checks/
   ```

3. if you want to add data to the results run the following command:
   ```sh
   curl -X POST -H "Content-Type: application/json" -d '{
       "check_field": {
           "target": {
               "domain_name": "first_domain"
           },
           "name": "https",
           "data": {
             "http_method": "GET",
             "status_code": 200,
             "port": 443,
             "headers": {"auth": "some token"}
           }
       },
       "timestamp": "2023-07-18T09:30:00+02:00",
       "data": {
             "http_method": "GET",
             "status_code": 404,
             "port": 443,
             "headers": {"auth": "some token"}
           }
   }' http://127.0.0.1:8000/api/results/
   ```

## Getting data from DRF:

1. if you want get a list of targets
   
   ```sh
    curl http://127.0.0.1:8000/api/targets/
   ```
   response:
    ```json
    [
        {
             "id": 1,
             "domain_name": "first_domain"
        },
        {
             "id": 2,
            "domain_name": "second_domain"
        },
     ...
    ]
    ```

2. if you want get a list of checks

   ```sh
    curl http://127.0.0.1:8000/api/checks/
   ```
   results:
   ```json
    [
        {
            "id": 1,
            "target": {
            "id": 7,
                "domain_name": "second_domain"
            },
            "name": "ssh",
            "data": {
                "port": 22
            }
        },
        {
            "id": 2,
            "target": {
              "id": 8,
              "domain_name": "first_domain"
            },
            "name": "http",
            "data": {
                "port": 443,
                "headers": {
                    "auth": "some token"
                },
                "http_method": "GET",
                "status_code": 200
            }
        },
        ...
    ]
   ```
3. if you want get a list of results

   ```sh
    curl http://127.0.0.1:8000/api/results/
   ```
   results:
   ```json
   [
       {
           "id": 1,
           "check_field": {
               "id": 8,
               "target": {
                   "id": 14,
                   "domain_name": "first_domain"
               },
               "name": "ssh",
               "data": {
                   "port": 22
               }
           },
           "timestamp": "2023-07-18T07:30:00Z",
           "data": {
               "status": "timeout"
           }
       },
       {
           "id": 2,
           "check_field": {
               "id": 9,
               "target": {
                   "id": 15,
                   "domain_name": "second_domain"
               },
               "name": "ssh",
               "data": {
                   "port": 22
               }
           },
           "timestamp": "2023-07-18T07:30:00Z",
           "data": {
               "status": "timeout"
           }
       },
       ...
   ]
   ```