from django.db import  transaction
from django.utils import timezone
from .models import Habit,HabitLog
from rest_framework.exceptions import ValidationError

class HabitService:
    @staticmethod
    @transaction.atomic
    def log_today(habit: Habit, value, note: str = "",) -> HabitLog:
        today = timezone.localdate()

        if today < habit.start_date:
            raise ValidationError(
                {
                    "habit": [
                        "Thói quen này chưa đến ngày bắt đầu."
                    ]
                }
            )

        if habit.end_date is not None and today > habit.end_date:
            raise ValidationError(
                {
                    "habit": [
                        "Thói quen này đã kết thúc."
                    ]
                }
            )

        if value < 0:
            raise ValidationError(
                {
                    "value": [
                        "Giá trị thực hiện không được nhỏ hơn 0."
                    ]
                }
            )

        if value >= habit.target_value:
            log_status = HabitLog.Status.COMPLETED
        else:
            log_status = HabitLog.Status.PENDING

        habit_log, created = HabitLog.objects.update_or_create(
            habit=habit,
            date=today,
            defaults={
                "value": value,
                "status": log_status,
                "note": note,
            },
        )

        return habit_log