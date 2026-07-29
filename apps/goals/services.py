from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction

from apps.ai.services import GoalAIService

from .models import (
    Goal,
    GoalAIPlan,
    GoalProgress,
    Milestone,
    Task,
)


class GoalService:
    @staticmethod
    def create_goal(user, goal_data):
        return Goal.objects.create(
            user=user,
            **goal_data,
        )

    @staticmethod
    def create_ai_plan(goal, plan_data):
        return GoalAIPlan.objects.create(
            goal=goal,
            difficulty=plan_data["difficulty"],
            estimated_duration=plan_data["estimated_duration"],
            recommended_hours_per_week=(
                plan_data.get("recommended_hours_per_week")
            ),
        )

    @staticmethod
    def create_tasks(milestone, tasks_data):
        for task_data in tasks_data:
            Task.objects.create(
                milestone=milestone,
                **task_data,
            )

    @staticmethod
    def create_milestones(goal, milestones_data):
        for milestone_data in milestones_data:
            milestone_payload = milestone_data.copy()

            tasks_data = milestone_payload.pop(
                "tasks",
                [],
            )

            milestone = Milestone.objects.create(
                goal=goal,
                **milestone_payload,
            )

            GoalService.create_tasks(
                milestone=milestone,
                tasks_data=tasks_data,
            )

    @staticmethod
    def create_goal_with_plan(user, goal_data):
        ai_plan_data = GoalAIService.generate_plan(
            goal_data
        )

        with transaction.atomic():
            goal = GoalService.create_goal(
                user=user,
                goal_data=goal_data,
            )

            GoalService.create_ai_plan(
                goal=goal,
                plan_data=ai_plan_data,
            )

            GoalService.create_milestones(
                goal=goal,
                milestones_data=(
                    ai_plan_data["milestones"]
                ),
            )

            GoalProgressService.create_snapshot(
                goal=goal,
                ai_feedback=(
                    "Mục tiêu và kế hoạch AI "
                    "đã được khởi tạo."
                ),
            )

            return goal


class GoalProgressService:
    @staticmethod
    def calculate_progress(goal: Goal) -> Decimal:
        tasks = Task.objects.filter(
            milestone__goal=goal,
        )

        total_tasks = tasks.count()

        if total_tasks == 0:
            return Decimal("0.00")

        completed_tasks = tasks.filter(
            status=Task.Status.COMPLETED,
        ).count()

        progress = (
            Decimal(completed_tasks)
            / Decimal(total_tasks)
            * Decimal("100")
        )

        return progress.quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

    @staticmethod
    @transaction.atomic
    def create_snapshot(
        goal: Goal,
        ai_feedback: str = "",
        note: str = "",
    ) -> GoalProgress:
        progress_percentage = (
            GoalProgressService.calculate_progress(
                goal
            )
        )

        return GoalProgress.objects.create(
            goal=goal,
            progress_percentage=(
                progress_percentage
            ),
            ai_feedback=ai_feedback,
            note=note,
        )