from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Habit, HabitLog


class HabitService:

    @staticmethod
    @transaction.atomic
    def log_today(
        habit: Habit,
        value,
        note: str = "",
    ) -> HabitLog:
        today = timezone.localdate()

        if today < habit.start_date:
            raise ValidationError(
                {
                    "habit": [
                        "Thói quen này chưa đến ngày bắt đầu."
                    ]
                }
            )

        if (
            habit.end_date is not None
            and today > habit.end_date
        ):
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

    @staticmethod
    def get_period_range(habit: Habit, target_date):
        if habit.frequency == Habit.Frequency.DAILY:
            start_date = target_date
            end_date = target_date

        elif habit.frequency == Habit.Frequency.WEEKLY:
            start_date = target_date - timedelta(
                days=target_date.weekday()
            )

            end_date = start_date + timedelta(days=6)

        elif habit.frequency == Habit.Frequency.MONTHLY:
            start_date = target_date.replace(day=1)

            if target_date.month == 12:
                next_month = target_date.replace(
                    year=target_date.year + 1,
                    month=1,
                    day=1,
                )
            else:
                next_month = target_date.replace(
                    month=target_date.month + 1,
                    day=1,
                )

            end_date = next_month - timedelta(days=1)

        else:
            start_date = target_date
            end_date = target_date

        return start_date, end_date

    @staticmethod
    def get_period_value(
        habit: Habit,
        start_date,
        end_date,
    ):
        logs = HabitLog.objects.filter(
            habit=habit,
            date__range=(
                start_date,
                end_date,
            ),
        )

        return sum(
            (log.value for log in logs),
            Decimal("0"),
        )

    @staticmethod
    def get_current_progress(habit: Habit):
        today = timezone.localdate()

        start_date, end_date = (
            HabitService.get_period_range(
                habit,
                today,
            )
        )

        current_value = HabitService.get_period_value(
            habit,
            start_date,
            end_date,
        )

        target = habit.target_value

        percentage = (
            round(
                float(
                    current_value
                    / target
                    * 100
                ),
                2,
            )
            if target > 0
            else 0
        )

        percentage = min(
            percentage,
            100,
        )

        completed = (
            current_value >= target
        )

        return {
            "current": current_value,
            "target": target,
            "percentage": percentage,
            "completed": completed,
            "start_date": start_date,
            "end_date": end_date,
        }

    @staticmethod
    def is_period_completed(
        habit: Habit,
        start_date,
        end_date,
    ):
        value = HabitService.get_period_value(
            habit,
            start_date,
            end_date,
        )

        return value >= habit.target_value

    @staticmethod
    def get_previous_period_date(
        habit: Habit,
        target_date,
    ):
        if habit.frequency == Habit.Frequency.DAILY:
            return target_date - timedelta(days=1)

        if habit.frequency == Habit.Frequency.WEEKLY:
            return target_date - timedelta(days=7)

        if habit.frequency == Habit.Frequency.MONTHLY:
            first_day = target_date.replace(day=1)

            return first_day - timedelta(days=1)

        return target_date - timedelta(days=1)

    @staticmethod
    def get_periods(habit: Habit):
        today = timezone.localdate()

        current_date = today
        periods = []

        while True:
            start_date, end_date = (
                HabitService.get_period_range(
                    habit,
                    current_date,
                )
            )

            if end_date < habit.start_date:
                break

            effective_start = max(
                start_date,
                habit.start_date,
            )

            effective_end = end_date

            if habit.end_date is not None:
                effective_end = min(
                    effective_end,
                    habit.end_date,
                )

            effective_end = min(
                effective_end,
                today,
            )

            if effective_start <= effective_end:
                completed = (
                    HabitService.is_period_completed(
                        habit,
                        effective_start,
                        effective_end,
                    )
                )

                periods.append(
                    {
                        "start_date": effective_start,
                        "end_date": effective_end,
                        "completed": completed,
                    }
                )

            current_date = (
                HabitService.get_previous_period_date(
                    habit,
                    start_date,
                )
            )

        return periods

    @staticmethod
    def calculate_current_streak(periods):
        streak = 0

        for period in periods:
            if period["completed"]:
                streak += 1
            else:
                break

        return streak

    @staticmethod
    def calculate_longest_streak(periods):
        longest = 0
        current = 0

        for period in reversed(periods):
            if period["completed"]:
                current += 1
                longest = max(
                    longest,
                    current,
                )
            else:
                current = 0

        return longest

    @staticmethod
    def get_statistics(habit: Habit):
        periods = HabitService.get_periods(habit)

        total_periods = len(periods)

        total_completions = sum(
            1
            for period in periods
            if period["completed"]
        )

        current_streak = (
            HabitService.calculate_current_streak(
                periods
            )
        )

        longest_streak = (
            HabitService.calculate_longest_streak(
                periods
            )
        )

        completion_rate = (
            round(
                total_completions
                / total_periods
                * 100,
                2,
            )
            if total_periods > 0
            else 0
        )

        return {
            "total_completions": total_completions,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "completion_rate": completion_rate,
        }