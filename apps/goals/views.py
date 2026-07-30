from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Goal, Task  
from .serializers import (
    GoalCreateSerializer,
    GoalListSerializer,
    GoalDetailSerializer,
    TaskUpdateSerializer
)
from .services import GoalService, TaskService


class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return( 
            Goal.objects
            .filter(user=self.request.user)
            .select_related("ai_plan")
            .prefetch_related(
                "milestones",
                "milestones__tasks",
                )
        
        )
    def get_serializer_class(self):
        if self.action == "list":
            return GoalListSerializer

        elif self.action == "retrieve":
            return GoalDetailSerializer

        return GoalCreateSerializer

class TaskViewSet(viewsets.GenericViewSet):
    serializer_class = TaskUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            milestone__goal__user=self.request.user
        )

    def partial_update(self, request, pk=None):
        task = self.get_object()

        serializer = self.get_serializer(
            task,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        TaskService.update_task_status(
            task=task,
            status=serializer.validated_data["status"],
        )

        return Response(
            TaskUpdateSerializer(task).data,
            status=status.HTTP_200_OK,
        )