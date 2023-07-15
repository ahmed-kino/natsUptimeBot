# NATS UPTIME BOT

This is a demo django app to view how we're laying out the model for NATS UPTIME BOT

## Model

the model's architecture looks like the following

```python
class Target(models.Model):
    domain_name = models.CharField(max_length=253)
    port = models.IntegerField()


class Check(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    last_activity = models.DateTimeField()
    cert_expiry_date = models.DateTimeField()
    uptime = models.DateTimeField()
    status = models.CharField(max_length=32)
```

where target would have multiple checks
