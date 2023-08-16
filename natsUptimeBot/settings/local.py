from .base import *

DEBUG = True


ALLOWED_HOSTS = [
    "0.0.0.0",
    "10.0.0.6",
    "127.0.0.0",
    "localhost",
    "192.168.0.46",
    "nats-uptime-bot-service.uptimebot.svc.cluster.local",
]

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
]

NATS_SERVER_URL = "nats://nats:4222"
