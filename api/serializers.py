from rest_framework import serializers

from .models import Check, Result, Target


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"


class CheckSerializer(serializers.ModelSerializer):
    target = TargetSerializer()

    class Meta:
        model = Check
        fields = ["id", "target", "name", "data"]

    def create(self, validated_data):
        target_data = validated_data.pop("target")
        target, created = Target.objects.get_or_create(**target_data)
        if created:
            print(
                f"target {target.domain_name} did not exist so a new target got created in the DB"
            )
        check = Check.objects.create(target=target, **validated_data)
        return check


class ResultSerializer(serializers.ModelSerializer):
    check_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Result
        fields = ["id", "check_id", "timestamp", "data"]

    def create(self, validated_data):
        check_id = validated_data.pop("check_id")

        try:
            check_instance = Check.objects.get(id=check_id)
        except Check.DoesNotExist:
            raise serializers.ValidationError(
                f"Check with ID '{check_id}' does not exist."
            )

        result = Result.objects.create(check_field=check_instance, **validated_data)
        return result

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["check_id"] = instance.check_field.id
        return data
