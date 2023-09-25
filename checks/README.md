# Probing targets


## build and push:

Run the following

```sh
make build && make push
```


## expected data from:

### event source

```json
{"context": {
         "id":"33323838616263362d363935662d343535372d383135332d333666653462373734616361",
         "source":"nats",
         "specversion":"1.0",
         "type":"nats",
         "datacontenttype":"application/json",
         "subject":"example",
         "time":"2023-09-22T18:44:21Z"
   },
   "data":"eyJzdWJqZWN0IjoiY2hlY2suY3JlYXRlZCIsImJvZHkiOlt7Im1vZGVsIjoiYXBpLmNoZWNrIiwicGsiOjQyLCJmaWVsZHMiOnsidGFyZ2V0IjoyMCwibmFtZSI6ImFzZGFzZHNhZCIsImRhdGEiOnsiZGVzY3JpcHRpb24iOiJhc2Rhc2RzYWQiLCJpbnRlcnZhbCI6IjUiLCJoZWFkZXJzIjoiIiwibWF4UmV0cmllcyI6IjIwIiwiY2hlY2tfdHlwZSI6IkhUVFBTKHMpIiwic3RhdHVzX2NvZGUiOlsiWzIwMCAtIDI5OV0iXSwibWV0aG9kIjoiR0VUIiwiYm9keSI6IiJ9fX1dfQ=="
}
```

### decoded data

```json
{
    "subject": "check.created",
    "body": {
        "id":1,
        "target": {
            "id":1,
            "domain_name":"test_domain"
        },
        "name":"http",
        "data":{
            "description": "asdasdsad",
            "interval": "5",
            "headers": "",
            "maxRetries": "20",
            "check_type": "HTTPS(s)",
            "status_code": ["[200 - 299]"],
            "method": "GET",
            "body": "",
        }
    }
}
```