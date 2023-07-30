from django.apps import AppConfig


class NatsIntegrationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "nats_integration"

    def ready(self):
        import nats_integration.signals
