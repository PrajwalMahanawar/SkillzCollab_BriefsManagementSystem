# analytics/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import BriefRelationship
from .network_analysis import (
    build_brief_network,
    calculate_network_metrics,
    graph_to_json,
)

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import BriefRelationship
from .serializers import BriefRelationshipSerializer


class BriefRelationshipCreateAPIView(generics.CreateAPIView):
    queryset = BriefRelationship.objects.all()
    serializer_class = BriefRelationshipSerializer
    permission_classes = [IsAuthenticated]


class BriefNetworkAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        relationships = BriefRelationship.objects.select_related(
            "source_brief", "target_brief"
        )

        G = build_brief_network(relationships)

        return Response(
            {"graph": graph_to_json(G), "metrics": calculate_network_metrics(G)}
        )
