from django.utils import timezone

from apps.goals.models import Goal
from apps.habits.models import Habit, HabitLog
from apps.wardrobe.models import ClothingItem


class DashboardService:

    @staticmethod
    def get_dashboard_data(user):
        return {
            "goals": DashboardService.get_goal_summary(user),
            "habits": DashboardService.get_habit_summary(user),
            "wardrobe": DashboardService.get_wardrobe_summary(user),
        }

    @staticmethod
    def get_goal_summary(user):
        goals = Goal.objects.filter(user=user,)

        total = goals.count()

        completed = goals.filter(
            status=Goal.Status.COMPLETED,
        ).count()

        in_progress = goals.filter(
            status=Goal.Status.IN_PROGRESS,
        ).count()

        completion_rate = (
            round(completed / total * 100, 2)
            if total > 0
            else 0
        )

        return {
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "completion_rate": completion_rate,
        }

    @staticmethod
    def get_habit_summary(user):
        today = timezone.localdate()

        active_habits = Habit.objects.filter(user=user,is_active=True,)

        active = active_habits.count()

        completed_today = HabitLog.objects.filter(
            habit__in=active_habits,
            date=today,
            status=HabitLog.Status.COMPLETED,
        ).count()

        completion_rate = (
            round(completed_today / active * 100, 2)
            if active > 0
            else 0
        )

        return {
            "active": active,
            "completed_today": completed_today,
            "completion_rate": completion_rate,
        }

    @staticmethod
    def get_wardrobe_summary(user):
        active_items = ClothingItem.objects.filter(
            user=user,
            is_active=True,
        )

        total = active_items.count()

        favorites = active_items.filter(
            is_favorite=True,
        ).count()

        return {
            "total": total,
            "favorites": favorites,
        }