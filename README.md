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

where target would have multiple checks
