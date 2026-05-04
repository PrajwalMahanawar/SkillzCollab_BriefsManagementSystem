from rest_framework import serializers
from .models import BriefRelationship


class BriefRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = BriefRelationship
        fields = [
            "id",
            "source_brief",
            "target_brief",
            "relationship_type",
            "weight",
            "created_at",
        ]
