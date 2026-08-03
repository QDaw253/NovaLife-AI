from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Habit
from .serializers import (
    HabitCreateSerializer,
    HabitDetailSerializer,
    HabitListSerializer,
    HabitLogSerializer,
    HabitLogTodaySerializer,
    HabitUpdateSerializer,
)
from .services import HabitService

class HabitViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return (
            Habit.objects
            .filter(user=self.request.user)
            .prefetch_related("logs")
        )
    def get_serializer_class(self):
        if self.action == "list":
            return HabitListSerializer

        elif self.action == "retrieve":
            return HabitDetailSerializer

        elif self.action in ("update", "partial_update"):
            return HabitUpdateSerializer

        return HabitCreateSerializer

    @action(
        detail=True,
        methods=["post"],
        url_path="complete-today",
    )
    def complete_today(self, request, pk=None):
        habit = self.get_object()

        serializer = HabitLogTodaySerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        habit_log = HabitService.log_today(
            habit=habit,
            value=serializer.validated_data["value"],
            note=serializer.validated_data.get("note", ""),
        )

        return Response(
            HabitLogSerializer(habit_log).data,
            status=status.HTTP_200_OK,
        )
