from rest_framework import serializers
from datetime import date


class GoalAITaskResultSerializer(serializers.Serializer):
    title = serializers.CharField(
        max_length=255,
    )
    description = serializers.CharField(
        allow_blank=True,
        required=False,
        default="",
    )
    priority = serializers.ChoiceField(
        choices=[
            "low",
            "medium",
            "high",
        ],
    )
    deadline = serializers.DateField()
    estimated_minutes = serializers.IntegerField(
        min_value=1,
        allow_null=True,
        required=False,
    )
    order = serializers.IntegerField(
        min_value=1,
    )

    def validate_deadline(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "Deadline của task không được nằm trong quá khứ."
            )

        return value


class GoalAIMilestoneResultSerializer(serializers.Serializer):
    title = serializers.CharField(
        max_length=255,
    )
    description = serializers.CharField(
        allow_blank=True,
        required=False,
        default="",
    )
    deadline = serializers.DateField()
    order = serializers.IntegerField(
        min_value=1,
    )
    tasks = GoalAITaskResultSerializer(
        many=True,
    )
    def validate_deadline(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "Deadline của milestone không được nằm trong quá khứ."
            )

        return value
    def validate_tasks(self, value):
        if not 2 <= len(value) <= 5:
            raise serializers.ValidationError(
                "Mỗi milestone phải có từ 2 đến 5 task."
            )

        return value


class GoalAIPlanResultSerializer(serializers.Serializer):
    difficulty = serializers.ChoiceField(
        choices=[
            "easy",
            "medium",
            "hard",
        ],
    )
    estimated_duration = serializers.CharField(
        max_length=100,
    )
    recommended_hours_per_week = serializers.IntegerField(
        min_value=1,
        allow_null=True,
        required=False,
    )
    milestones = GoalAIMilestoneResultSerializer(
        many=True,
    )
    def validate_milestones(self, value):
        if not 3 <= len(value) <= 6:
            raise serializers.ValidationError(
                "Kế hoạch phải có từ 3 đến 6 milestone."
            )

        return value

    def validate(self, attrs):
        goal_deadline = self.context.get(
            "goal_deadline"
        )

        if goal_deadline is None:
            return attrs

        for milestone in attrs["milestones"]:
            if milestone["deadline"] > goal_deadline:
                raise serializers.ValidationError(
                    {
                        "milestones": (
                            "Deadline của milestone không được "
                            "vượt quá deadline của mục tiêu."
                        )
                    }
                )

            for task in milestone["tasks"]:
                if task["deadline"] > goal_deadline:
                    raise serializers.ValidationError(
                        {
                            "tasks": (
                                "Deadline của task không được "
                                "vượt quá deadline của mục tiêu."
                            )
                        }
                    )

        return attrs