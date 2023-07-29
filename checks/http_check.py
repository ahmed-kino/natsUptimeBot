#!/usr/bin/env python3

import argparse
from datetime import datetime

import requests


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-d",
        "--domain_name",
        type=str,
        help="Specify target domain name",
        required=True,
    )
    return parser.parse_args()


class HttpCheck:
    def __init__(self, args):
        self.domain_name = args.domain_name

    def _convert_timedelta_to_iso(self, elapsed):
        reference_date = datetime.now()
        result_datetime = reference_date + elapsed
        return result_datetime.isoformat()

    def run(self):
        try:
            response = requests.head(self.domain_name, timeout=5)

            result_dict = {
                "timestamp": datetime.now(),
                "domain_name": self.domain_name,
                "status_code": response.status_code,
                "reason": response.reason,
                "headers": dict(response.headers),
                "response_time": f"{response.elapsed.total_seconds() * 1000:.2f} milliseconds",
                "content_length": len(response.content),
            }

            return result_dict
        except requests.exceptions.RequestException as e:
            print("RequestException:", e)
        except Exception as e:
            print("Exception:", e)


if __name__ == "__main__":
    args = get_args()
    check = HttpCheck(args)
    print(check.run())
