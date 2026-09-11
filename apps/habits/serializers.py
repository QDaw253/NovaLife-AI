from datetime import date

from rest_framework import serializers

from .models import Habit, HabitLog
from .services import HabitService


# =========================================================
# COMMON VALIDATION
# =========================================================

def validate_habit_title(value):
    value = value.strip()

    if not value:
        raise serializers.ValidationError(
            "Tên thói quen không được để trống."
        )

    if len(value) < 3:
        raise serializers.ValidationError(
            (
                "Tên thói quen quá ngắn. "
                "Hãy nhập một hành động cụ thể bạn muốn duy trì."
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
        "xxx",
    }

    if value.lower() in meaningless_values:
        raise serializers.ValidationError(
            (
                "Tên thói quen chưa mô tả một hành động cụ thể. "
                'Ví dụ: "Đọc sách", "Uống nước", '
                '"Tập thể dục".'
            )
        )

    return value


# =========================================================
# HABIT LOG
# =========================================================

class HabitLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = HabitLog

        fields = (
            "id",
            "date",
            "value",
            "status",
            "note",
        )


# =========================================================
# TODAY LOG
# =========================================================

class HabitLogTodaySerializer(serializers.Serializer):

    value = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0,
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )


# =========================================================
# CREATE HABIT
# =========================================================

class HabitCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Habit

        fields = (
            "id",
            "title",
            "description",
            "category",
            "frequency",
            "target_value",
            "unit",
            "start_date",
            "end_date",
            "reminder_time",
        )

        read_only_fields = (
            "id",
        )

        extra_kwargs = {
            "title": {
                "error_messages": {
                    "required":
                        "Vui lòng nhập tên thói quen.",
                    "blank":
                        "Tên thói quen không được để trống.",
                    "max_length":
                        "Tên thói quen quá dài.",
                }
            },

            "category": {
                "error_messages": {
                    "required":
                        "Vui lòng chọn danh mục.",
                    "invalid_choice":
                        "Danh mục thói quen không hợp lệ.",
                }
            },

            "frequency": {
                "error_messages": {
                    "required":
                        "Vui lòng chọn tần suất.",
                    "invalid_choice":
                        "Tần suất không hợp lệ.",
                }
            },

            "target_value": {
                "error_messages": {
                    "required":
                        "Vui lòng nhập giá trị mục tiêu.",
                    "invalid":
                        "Giá trị mục tiêu không hợp lệ.",
                }
            },

            "unit": {
                "error_messages": {
                    "required":
                        "Vui lòng nhập đơn vị.",
                    "blank":
                        "Đơn vị không được để trống.",
                }
            },

            "start_date": {
                "error_messages": {
                    "required":
                        "Vui lòng chọn ngày bắt đầu.",
                    "invalid":
                        "Ngày bắt đầu không hợp lệ.",
                }
            },
        }

    # =====================================================
    # TITLE
    # =====================================================

    def validate_title(self, value):
        return validate_habit_title(value)

    # =====================================================
    # TARGET VALUE
    # =====================================================

    def validate_target_value(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Giá trị mục tiêu phải lớn hơn 0."
            )

        return value

    # =====================================================
    # UNIT
    # =====================================================

    def validate_unit(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Đơn vị không được để trống."
            )

        if len(value) > 30:
            raise serializers.ValidationError(
                "Đơn vị quá dài."
            )

        return value

    # =====================================================
    # CROSS FIELD VALIDATION
    # =====================================================

    def validate(self, attrs):

        start_date = attrs.get(
            "start_date"
        )

        end_date = attrs.get(
            "end_date"
        )

        if (
            start_date
            and start_date < date.today()
        ):
            raise serializers.ValidationError(
                {
                    "start_date": [
                        (
                            "Ngày bắt đầu không được "
                            "nằm trong quá khứ."
                        )
                    ]
                }
            )

        if (
            start_date
            and end_date
            and end_date < start_date
        ):
            raise serializers.ValidationError(
                {
                    "end_date": [
                        (
                            "Ngày kết thúc không được "
                            "trước ngày bắt đầu."
                        )
                    ]
                }
            )

        return attrs

    # =====================================================
    # CREATE
    # =====================================================

    def create(self, validated_data):
        request = self.context["request"]

        return Habit.objects.create(
            user=request.user,
            **validated_data,
        )


# =========================================================
# HABIT LIST
# =========================================================

class HabitListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Habit

        fields = (
            "id",
            "title",
            "category",
            "frequency",
            "target_value",
            "unit",
            "reminder_time",
            "is_active",
        )


# =========================================================
# HABIT DETAIL
# =========================================================

class HabitDetailSerializer(serializers.ModelSerializer):

    recent_logs = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    statistics = serializers.SerializerMethodField()

    class Meta:
        model = Habit

        fields = (
            "id",
            "title",
            "description",
            "category",
            "frequency",
            "target_value",
            "unit",
            "start_date",
            "end_date",
            "reminder_time",
            "is_active",
            "created_at",
            "updated_at",
            "progress",
            "statistics",
            "recent_logs",
        )

    def get_progress(self, obj):
        return HabitService.get_current_progress(obj)


    def get_statistics(self, obj):
        return HabitService.get_statistics(obj)

    def get_recent_logs(self, obj):
        logs = obj.logs.all()[:7]

        return HabitLogSerializer(
            logs,
            many=True,
        ).data



class HabitUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Habit

        fields = (
            "title",
            "description",
            "category",
            "frequency",
            "target_value",
            "unit",
            "reminder_time",
            "end_date",
            "is_active",
        )

        extra_kwargs = {
            "title": {
                "error_messages": {
                    "blank":
                        "Tên thói quen không được để trống.",
                }
            },

            "category": {
                "error_messages": {
                    "invalid_choice":
                        "Danh mục thói quen không hợp lệ.",
                }
            },

            "frequency": {
                "error_messages": {
                    "invalid_choice":
                        "Tần suất không hợp lệ.",
                }
            },

            "target_value": {
                "error_messages": {
                    "invalid":
                        "Giá trị mục tiêu không hợp lệ.",
                }
            },

            "unit": {
                "error_messages": {
                    "blank":
                        "Đơn vị không được để trống.",
                }
            },
        }


    def validate_title(self, value):
        return validate_habit_title(value)


    def validate_target_value(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Giá trị mục tiêu phải lớn hơn 0."
            )

        return value


    def validate_unit(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Đơn vị không được để trống."
            )

        return value


    def validate_end_date(self, value):

        if (
            value is not None
            and value < date.today()
        ):
            raise serializers.ValidationError(
                (
                    "Ngày kết thúc không được "
                    "nằm trong quá khứ."
                )
            )

        return value