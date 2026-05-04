# analytics/models.py

from django.db import models
from accounts.models import Competition, User


class BriefRelationship(models.Model):
    source_brief = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="outgoing_relationships"
    )

    target_brief = models.ForeignKey(
        Competition, on_delete=models.CASCADE, related_name="incoming_relationships"
    )

    relationship_type = models.CharField(
        max_length=50,
        choices=[
            ("derived_from", "Derived From"),
            ("similar_to", "Similar To"),
            ("inspired_by", "Inspired By"),
            ("duplicate_of", "Duplicate Of"),
        ],
        default="derived_from",
    )

    weight = models.FloatField(default=1.0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_brief} → {self.target_brief}"
