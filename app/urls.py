from django.urls import path
from .views import (
    TargetListCreateView,
    TargetRetrieveUpdateDestroyView,
    CheckListCreateView,
    CheckRetrieveUpdateDestroyView,
    ResultListCreateView,
    ResultRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("targets/", TargetListCreateView.as_view(), name="target-list"),
    path(
        "targets/<int:pk>/",
        TargetRetrieveUpdateDestroyView.as_view(),
        name="target-detail",
    ),
    path("checks/", CheckListCreateView.as_view(), name="check-list"),
    path(
        "checks/<int:pk>/",
        CheckRetrieveUpdateDestroyView.as_view(),
        name="check-detail",
    ),
    path("results/", ResultListCreateView.as_view(), name="result-list"),
    path(
        "results/<int:pk>/",
        ResultRetrieveUpdateDestroyView.as_view(),
        name="result-detail",
    ),
]
