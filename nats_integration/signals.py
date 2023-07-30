import asyncio

from django.db.models.signals import post_save
from django.dispatch import receiver

from api.models import Check

from .nats_publisher import publish_nats_message


@receiver(post_save, sender=Check)
def check_created(sender, instance, created, **kwargs):
    if created:
        message = f"New Check created: {instance.name}, Target: {instance.target}, Data: {instance.data}"
        asyncio.run(publish_nats_message("check.created", message))
