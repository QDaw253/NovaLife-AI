from datetime import date
from rest_framework import serializers
from .models import Habit, HabitLog

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
        read_only_fields = ("id",)

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Tên thói quen không được để trống.")

        return value    

    def validate_target_value(self, value):
        if value <=0:
            raise serializers.ValidationError("Giá trị mục tiêu phải lớn hơn 0.")
        return value

    def validate(self, attrs):
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if start_date and start_date < date.today():
            raise serializers.ValidationError(
                {
                    "start_date":("Ngày bắt đầu không được nằm trong quá khứ")
                }
            )

        if(start_date and end_date and end_date<start_date):
            raise serializers.ValidationError(
                {
                    "end_date":("Ngày kết thúc không được trước ngày bắt đầu")
                }
            )

        return attrs

    def create(self, validated_data):
        request = self.context["request"]

        return Habit.objects.create(
            user=request.user,
            **validated_data,
        )

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

class HabitDetailSerializer(serializers.ModelSerializer):
    recent_logs = serializers.SerializerMethodField()
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
            "recent_logs",
        )

    def get_recent_logs(self, obj):
        logs = obj.logs.all()[:7]
        return HabitLogSerializer(logs, many = True,).data

class HabitUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = (
            "title",
            "description",
            "category",
            "reminder_time",
            "end_date",
            "is_active",
        )

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Tên thói quen không được để trống."
            )

        return value

    def validate_end_date(self, value):
        if value is not None and value < date.today():
            raise serializers.ValidationError(
                "Ngày kết thúc không được nằm trong quá khứ."
            )

        return value