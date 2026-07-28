from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Goal
from .serializers import (
    GoalCreateSerializer,
    GoalListSerializer,
    GoalDetailSerializer,
)


class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return GoalListSerializer

        elif self.action == "retrieve":
            return GoalDetailSerializer

        return GoalCreateSerializer

