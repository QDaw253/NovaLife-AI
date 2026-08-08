from rest_framework import serializers
from datetime import date

from .models import Goal, GoalAIPlan, Task, Milestone
from .services import GoalProgressService, GoalService

class GoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = (
            "id",
            "title",
            "category",
            "description",
            "priority",
            "deadline",
        )
        extra_kwargs = {
            "priority": {
                "required": False,
                "default": "medium",
            }
        }

    def validate_title(self, value):
        if not value.strip(): #strip() tức khoảng trắng 
            raise serializers.ValidationError(
                "tiêu đề mục tiêu không được để trống."
            )
        return value

    def validate_deadline(self, value):
        if value is not None and value < date.today():
            raise serializers.ValidationError(
                "deadline không được nằm trong quá khứ."
            )
        return value

    def create(self, validated_data):
        request = self.context["request"]

        return GoalService.create_goal_with_plan(
            user=request.user,
            goal_data=validated_data,
        )

class GoalListSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = (
            "id",
            "title",
            "category",
            "priority",
            "status",
            "deadline",
            "progress",
        )

    def get_progress(self, obj):
        return GoalProgressService.calculate_progress(obj)

class GoalAIPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalAIPlan
        fields = (
            "difficulty",
            "estimated_duration",
            "recommended_hours_per_week",
        )

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "deadline",
            "estimated_minutes",
            "order",
            "status",
        )

class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["status",]

class MilestoneSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Milestone
        fields = (
            "id",
            "title",
            "description",
            "status",
            "deadline",
            "order",
            "tasks",
        )

class GoalDetailSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    ai_plan = GoalAIPlanSerializer(
            read_only=True,
        )
    
    milestones = MilestoneSerializer(
            many=True,
            read_only=True,
        )

    class Meta:
        model = Goal
        fields = (
            "id",
            "title",
            "description",
            "category",
            "priority",
            "status",
            "deadline",
            "created_at",
            "updated_at",
            "progress",
            "ai_plan",
            "milestones",
        )

    def get_progress(self, obj):
        return GoalProgressService.calculate_progress(obj)

