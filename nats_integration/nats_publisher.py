import asyncio
import json

import nats
from django.conf import settings
from nats.errors import ConnectionClosedError, NoServersError, TimeoutError


async def publish_to_nats(subject, data):
    """Publish a message to a given NATS subject."""
    nc = await nats.connect(settings.NATS_SERVER_URL)
    print("Connected to NATS server:", nc.is_connected)

    try:
        await nc.publish(subject, data.encode())
        print(f"Published message to subject --->'{subject}' data: ---> {data}")
    except (ConnectionClosedError, TimeoutError, NoServersError) as e:
        print(f"Error publishing to NATS: {e}")
    finally:
        await nc.close()


async def listen_to_nats(subject):
    """Listen to a given NATS subject and print received messages."""
    nc = await nats.connect(settings.NATS_SERVER_URL)
    print("Connected to NATS server:", nc.is_connected)

    async def message_handler(msg):
        print(f"Received a message on '{msg.subject} {msg.reply}': {msg.data.decode()}")

    await nc.subscribe(subject, cb=message_handler)

    try:
        # Keep the connection alive (assuming you want to continuously listen)
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        pass
    finally:
        await nc.close()
