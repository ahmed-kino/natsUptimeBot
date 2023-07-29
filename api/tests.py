from django.forms.models import model_to_dict
from django.test import TestCase

from .models import Check, Result, Target
from .serializers import CheckSerializer, ResultSerializer, TargetSerializer


class TargetSerializerTest(TestCase):
    def setUp(self):
        self.valid_data = {"domain_name": "example.com"}

    def test_valid_target_serialization(self):
        serializer = TargetSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        target_instance = serializer.save()

        self.assertIsInstance(target_instance, Target)
        self.assertEqual(target_instance.domain_name, self.valid_data["domain_name"])

    def test_invalid_target_serialization_missing_domain_name(self):
        del self.valid_data["domain_name"]
        serializer = TargetSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())

    def tearDown(self):
        Target.objects.all().delete()


class CheckSerializerTest(TestCase):
    def setUp(self):
        self.target_data = dict(domain_name="example.com")
        self.target = Target.objects.create(**self.target_data)

        self.check_data = {
            "target": model_to_dict(self.target),
            "name": "http",
            "data": {"k1": "v1", "k2": "v2"},
        }

    def test_valid_check_serialization(self):
        serializer = CheckSerializer(data=self.check_data)
        self.assertTrue(serializer.is_valid())
        check_instance = serializer.save()

        self.assertIsInstance(check_instance, Check)
        self.assertEqual(check_instance.target, self.target)
        self.assertEqual(check_instance.name, self.check_data["name"])
        self.assertEqual(check_instance.data, self.check_data["data"])

    def test_invalid_check_serialization_missing_target(self):
        del self.check_data["target"]
        serializer = CheckSerializer(data=self.check_data)
        self.assertFalse(serializer.is_valid())

    def tearDown(self):
        Check.objects.all().delete()
        Target.objects.all().delete()


class ResultSerializerTest(TestCase):
    def setUp(self):
        self.target_data = {"domain_name": "example.com"}
        self.target = Target.objects.create(**self.target_data)

        self.check_data = {
            "target": self.target,
            "name": "http",
            "data": {"k1": "v1", "k2": "v2"},
        }

        self.check_instance = Check.objects.create(**self.check_data)
        self.result_data = {
            "check_field": {
                "id": self.check_instance.id,
                "target": model_to_dict(self.target),
                "name": self.check_instance.name,
                "data": self.check_instance.data,
            },
            "timestamp": "2023-07-17T12:00:00+00:00",
            "data": {"result_key": "result_value"},
        }

    def test_valid_result_serialization(self):
        serializer = ResultSerializer(data=self.result_data)
        if not serializer.is_valid():
            print(serializer.errors)
        self.assertTrue(serializer.is_valid())
        result_instance = serializer.save()

        self.assertIsInstance(result_instance, Result)
        self.assertEqual(result_instance.check_field, self.check_instance)
        self.assertEqual(
            result_instance.timestamp.isoformat(), self.result_data["timestamp"]
        )
        self.assertEqual(result_instance.data, self.result_data["data"])

    def test_invalid_result_serialization_missing_check(self):
        del self.result_data["check_field"]
        serializer = ResultSerializer(data=self.result_data)
        self.assertFalse(serializer.is_valid())

    def tearDown(self):
        Result.objects.all().delete()
        Check.objects.all().delete()
        Target.objects.all().delete()
