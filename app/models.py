from django.db import models


class Target(models.Model):
    domain_name = models.CharField(max_length=253)
    port = models.IntegerField()


class Check(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    last_activity = models.DateTimeField()
    cert_expiry_date = models.DateTimeField()
    uptime = models.DateTimeField()
    # this field can be an enum for different statuses
    status = models.CharField(max_length=32)
