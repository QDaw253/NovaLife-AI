from rest_framework import serializers
from datetime import date

from .models import Goal
from .services import GoalProgressService, GoalService

class GoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = (
            "title",
            "category",
            "description",
            "priority",
            "deadline",
        )

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

        return GoalService.create_goal(
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

class GoalDetailSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

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
        )

    def get_progress(self, obj):
        return GoalProgressService.calculate_progress(obj)