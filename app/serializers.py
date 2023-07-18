from rest_framework import serializers
from .models import Target, Check, Result


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ["id", "domain_name"]


class CheckSerializer(serializers.ModelSerializer):
    target = TargetSerializer()

    class Meta:
        model = Check
        fields = ["id", "target", "name", "data"]

    def create(self, validated_data):
        target_data = validated_data.pop("target")
        target_serializer = TargetSerializer(data=target_data)
        target_serializer.is_valid(raise_exception=True)
        target_instance = target_serializer.save()

        check = Check.objects.create(target=target_instance, **validated_data)
        return check


class ResultSerializer(serializers.ModelSerializer):
    check_field = CheckSerializer()

    class Meta:
        model = Result
        fields = ["id", "check_field", "timestamp", "data"]

    def create(self, validated_data):
        check_data = validated_data.pop("check_field")
        check_serializer = CheckSerializer(data=check_data)
        check_serializer.is_valid(raise_exception=True)
        check_instance = check_serializer.save()

        result = Result.objects.create(check_field=check_instance, **validated_data)
        return result
