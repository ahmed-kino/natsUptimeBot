import requests
from datetime import datetime
from django.http import JsonResponse
from django.forms.models import model_to_dict
from rest_framework import generics
from rest_framework.views import APIView

from .models import Check, Result, Target
from .serializers import CheckSerializer, ResultSerializer, TargetSerializer


class TargetListCreateView(generics.ListCreateAPIView):
    queryset = Target.objects.all()
    serializer_class = TargetSerializer


class TargetRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Target.objects.all()
    serializer_class = TargetSerializer


class CheckListCreateView(generics.ListCreateAPIView):
    queryset = Check.objects.all()
    serializer_class = CheckSerializer


class CheckRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Check.objects.all()
    serializer_class = CheckSerializer


class ResultListCreateView(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer


class ResultRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer


class UptimeCheckView(APIView):
    def _convert_timedelta_to_iso(self, elapsed):
        reference_date = datetime.now()
        result_datetime = reference_date + elapsed
        return result_datetime.isoformat()

    def post(self, request, *args, **kwargs):
        check_id = request.data.get("check_id", None)

        if not check_id:
            return JsonResponse(
                {"error": "Please provide 'check_id' in the request body."},
                status=400,
            )

        check_instance = Check.objects.get(id=check_id)

        try:
            response = requests.get(
                f"{check_instance.name}://{check_instance.target.domain_name}",
                timeout=5,
            )
            timestamp = self._convert_timedelta_to_iso(response.elapsed)
            status_code = response.status_code
            content_length = len(response.content)
            headers = dict(response.headers)
        except requests.RequestException:
            # NOTE: not sure if this is correct
            timestamp = datetime.now()
            status_code = 400
            content_length = None
            headers = {}

        data = dict(
            check_field={
                "target": {
                    "id": check_instance.target.id,
                    "domain_name": check_instance.target.domain_name,
                },
                "name": check_instance.name,
                "data": check_instance.data,
            },
            timestamp=timestamp,
            data=dict(
                status_code=status_code, content_length=content_length, headers=headers
            ),
        )

        serializer = ResultSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return JsonResponse({"status": "success", **serializer.data})
        else:
            return JsonResponse({"errors": serializer.errors}, status=400)
