import asyncio

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.renderers import JSONRenderer

from api.models import Check
from api.serializers import CheckSerializer

from .nats_publisher import publish_nats_message


@receiver(post_save, sender=Check)
def check_created(sender, instance, created, **kwargs):
    if created:
        serializer = CheckSerializer(instance)
        serialized_data = JSONRenderer().render(serializer.data)
        json_data = serialized_data.decode("utf-8")
        asyncio.run(publish_nats_message("check.created", json_data))
