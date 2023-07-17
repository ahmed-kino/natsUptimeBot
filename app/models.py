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
