import asyncio

import nats
from django.conf import settings
from nats.errors import ConnectionClosedError, NoServersError, TimeoutError


async def publish_nats_message(subject, message):
    nc = await nats.connect(settings.NATS_SERVER_URL)
    print("Connected to NATS server:", nc.is_connected)

    async def message_handler(msg):
        subject = msg.subject
        reply = msg.reply
        data = msg.data.decode()
        print(
            "Received a message on '{subject} {reply}': {data}".format(
                subject=subject, reply=reply, data=data
            )
        )

    sub = await nc.subscribe(subject, cb=message_handler)
    await nc.publish(subject, message.encode())

    try:
        async for msg in sub.messages:
            print(
                f"Received a message on '{msg.subject} {msg.reply}': {msg.data.decode()}"
            )
        await sub.unsubscribe()
    except Exception as e:
        pass

    await nc.drain()
