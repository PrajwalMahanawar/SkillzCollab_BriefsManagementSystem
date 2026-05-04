# analytics/urls.py
from django.urls import path
from .views import BriefNetworkAPIView, BriefRelationshipCreateAPIView

urlpatterns = [
    path("brief-network/", BriefNetworkAPIView.as_view(), name="brief-network"),
    path(
        "relationships/create/",
        BriefRelationshipCreateAPIView.as_view(),
        name="relationship-create",
    ),
]
