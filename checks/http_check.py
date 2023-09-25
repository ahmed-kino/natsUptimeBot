#!/usr/bin/env python3
import base64
import json
import sys
from datetime import datetime
from time import sleep

import requests


class HttpCheck:
    def __init__(self, event_payload):
        self.event_payload = event_payload
        self.data = self._extract_data_from_event_payload(self.event_payload)
        self.domain_name = self.data["target"]["domain_name"]

    def _extract_data_from_event_payload(self, event_payload):
        event_payload_dict = json.loads(event_payload)
        base64_data = event_payload_dict["data"]
        decoded_data = json.loads(base64.b64decode(base64_data).decode("utf-8"))
        return decoded_data["body"]

    def _probe(self):
        response = requests.head(self.domain_name, timeout=5)

        response_time = f"{response.elapsed.total_seconds() * 1000:.2f}"

        result_data = {
            "check_id": self.data["id"],
            "timestamp": datetime.now().isoformat(),
            "data": {
                "status_code": response.status_code,
                "reason": response.reason,
                "headers": dict(response.headers),
                "response_time": response_time,
                "response_time_str": f"{response_time} milliseconds",
                "content_length": len(response.content),
            },
        }

        post_to_result = requests.post(
            "http://nats-uptime-bot-service.uptimebot.svc.cluster.local:8000/api/results/",
            json=result_data,
        )
        print(post_to_result)

    def run(self):
        try:
            for _ in range(20):
                self._probe()
                sleep(int(self.data["data"]["interval"]))
        except requests.exceptions.RequestException as e:
            print("RequestException:", e)
        except Exception as e:
            print("Exception:", e)


if __name__ == "__main__":
    event_payload = sys.argv[1]
    check = HttpCheck(event_payload)
    check.run()
