from django.db import  transaction
from django.utils import timezone
from .models import Habit,HabitLog

class HabitService:
    @staticmethod
    @transaction.atomic
    def log_today(
        habit:Habit,
        value,
        note:str="",
    )->HabitLog:
        today = timezone.localdate()

        if value<0:
            raise ValueError("Giá trị thực hiện không được nhỏ hơn 0")

        if value>=habit.target_value:
            log_status = HabitLog.Status.COMPLETED
        else:
            log_status = HabitLog.Status.PENDING

        habit_log, created = HabitLog.objects.update_or_create(
            habit=habit,
            date = today,
            defaults={
                "value":value,
                "status":log_status,
                "note":note,
            },
        )

        return habit_log