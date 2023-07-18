from django.db import models


class Target(models.Model):
    domain_name = models.CharField(max_length=255)


class Check(models.Model):
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    data = models.JSONField(default=dict)


class Result(models.Model):
    check_field = models.ForeignKey(Check, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    data = models.JSONField(default=dict)
