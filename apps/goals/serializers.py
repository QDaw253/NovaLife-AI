from datetime import date

from rest_framework import serializers

from .models import (
    Goal,
    GoalAIPlan,
    Task,
    Milestone,
)
from .services import (
    GoalProgressService,
    GoalService,
)


# =========================================================
# GOAL CREATE / UPDATE
# =========================================================

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
            "title": {
                "error_messages": {
                    "required":
                        "Vui lòng nhập tên mục tiêu.",
                    "blank":
                        "Tên mục tiêu không được để trống.",
                    "max_length":
                        "Tên mục tiêu quá dài.",
                }
            },

            "description": {
                "required": True,
                "allow_blank": False,

                "error_messages": {
                    "required":
                        "Vui lòng mô tả mục tiêu.",
                    "blank":
                        "Vui lòng mô tả rõ kết quả bạn muốn đạt được.",
                    "max_length":
                        "Mô tả mục tiêu quá dài.",
                }
            },

            "category": {
                "error_messages": {
                    "required":
                        "Vui lòng chọn danh mục.",
                    "invalid_choice":
                        "Danh mục mục tiêu không hợp lệ.",
                }
            },

            "priority": {
                "required": False,
                "default": "medium",

                "error_messages": {
                    "invalid_choice":
                        "Mức độ ưu tiên không hợp lệ.",
                }
            },

            "deadline": {
                "required": True,
                "allow_null": False,

                "error_messages": {
                    "required":
                        "Vui lòng chọn thời hạn hoàn thành.",
                    "null":
                        "Vui lòng chọn thời hạn hoàn thành.",
                    "invalid":
                        "Thời hạn không hợp lệ.",
                    "invalid_date":
                        "Thời hạn phải có định dạng YYYY-MM-DD.",
                }
            },
        }

    # =====================================================
    # TITLE
    # =====================================================

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Tên mục tiêu không được để trống."
            )

        if len(value) < 5:
            raise serializers.ValidationError(
                (
                    "Tên mục tiêu chưa đủ rõ ràng. "
                    "Hãy mô tả cụ thể điều bạn muốn đạt được, "
                    'ví dụ: "Giảm 5kg", '
                    '"Đạt TOEIC 650" hoặc '
                    '"Hoàn thành khóa học React".'
                )
            )

        # Một số input rõ ràng là placeholder/test
        meaningless_values = {
            "hehe",
            "haha",
            "hihi",
            "test",
            "testing",
            "abc",
            "abcd",
            "asdf",
            "qwerty",
            "xxx",
        }

        if value.lower() in meaningless_values:
            raise serializers.ValidationError(
                (
                    "Tên mục tiêu chưa mô tả một kết quả cụ thể. "
                    "Hãy nhập điều bạn thực sự muốn đạt được."
                )
            )

        return value

    # =====================================================
    # DESCRIPTION
    # =====================================================

    def validate_description(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                (
                    "Vui lòng mô tả mục tiêu và kết quả "
                    "bạn muốn đạt được."
                )
            )

        if len(value) < 10:
            raise serializers.ValidationError(
                (
                    "Mô tả mục tiêu còn quá ngắn. "
                    "Hãy cung cấp thêm thông tin để NovaLife "
                    "có thể xây dựng lộ trình phù hợp."
                )
            )

        meaningless_values = {
            "hehe",
            "haha",
            "hihi",
            "test",
            "testing",
            "abc",
            "abcd",
            "asdf",
            "qwerty",
        }

        if value.lower() in meaningless_values:
            raise serializers.ValidationError(
                (
                    "Mô tả chưa cung cấp đủ thông tin "
                    "về mục tiêu bạn muốn đạt được."
                )
            )

        return value

    # =====================================================
    # DEADLINE
    # =====================================================

    def validate_deadline(self, value):

        if value <= date.today():
            raise serializers.ValidationError(
                (
                    "Thời hạn hoàn thành phải nằm "
                    "sau ngày hôm nay."
                )
            )

        return value

    # =====================================================
    # CREATE
    # =====================================================

    def create(self, validated_data):
        request = self.context["request"]

        return GoalService.create_goal_with_plan(
            user=request.user,
            goal_data=validated_data,
        )

    # =====================================================
    # UPDATE
    # =====================================================

    def update(self, instance, validated_data):

        return GoalService.update_goal(
            goal=instance,
            goal_data=validated_data,
        )


# =========================================================
# GOAL LIST
# =========================================================

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

        return GoalProgressService.calculate_progress(
            obj
        )


# =========================================================
# AI PLAN
# =========================================================

class GoalAIPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = GoalAIPlan

        fields = (
            "difficulty",
            "estimated_duration",
            "recommended_hours_per_week",
        )


# =========================================================
# TASK
# =========================================================

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


# =========================================================
# TASK UPDATE
# =========================================================

class TaskUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task

        fields = (
            "status",
        )


# =========================================================
# MILESTONE
# =========================================================

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


# =========================================================
# GOAL DETAIL
# =========================================================

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

        return GoalProgressService.calculate_progress(
            obj
        )