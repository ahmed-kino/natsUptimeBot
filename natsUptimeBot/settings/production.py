DEBUG = False

ALLOWED_HOSTS = ["nats-uptime-bot-service.uptimebot.svc.cluster.local"]

CORS_ORIGIN_WHITELIST = [
    "http://nats-uptime-bot-ui-service.uptimebot.svc.cluster.local",
]

NATS_SERVER_URL = "nats://nats.nats:4222"
