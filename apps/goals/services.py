from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction

from .models import Goal, GoalAIPlan, GoalProgress, Task, Milestone


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
                plan_data["recommended_hours_per_week"]
            ),
            plan_data=plan_data.get("plan_data", {}),
        )

    @staticmethod
    def create_milestones(goal, milestones_data):
        for milestone_data in milestones_data:
            milestone = Milestone.objects.create(
                goal=goal,
                title=milestone_data["title"],
                description=milestone_data.get("description", ""),
                deadline=milestone_data.get("deadline"),
                order=milestone_data["order"],
            )

            tasks_data = milestone_data.get("tasks", [])

            for task_data in tasks_data:
                Task.objects.create(
                    milestone=milestone,
                    title=task_data["title"],
                    description=task_data.get("description", ""),
                    priority=task_data.get(
                        "priority",
                        Task.Priority.MEDIUM,
                    ),
                    deadline=task_data.get("deadline"),
                    estimated_minutes=task_data.get(
                        "estimated_minutes"
                    ),
                    order=task_data["order"],
                )

    @staticmethod
    def create_initial_progress(goal):
        return GoalProgress.objects.create(
            goal=goal,
            progress_percentage=0,
            ai_feedback="Mục tiêu đã được khởi tạo.",
        )

    @staticmethod
    @transaction.atomic
    def create_goal_with_plan(user, goal_data, ai_result):
        goal = GoalService.create_goal(
            user=user,
            goal_data=goal_data,
        )

        GoalService.create_ai_plan(
            goal=goal,
            plan_data=ai_result,
        )

        GoalService.create_milestones(
            goal=goal,
            milestones_data=ai_result.get("milestones", []),
        )

        GoalService.create_initial_progress(goal)

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
            GoalProgressService.calculate_progress(goal)
        )

        return GoalProgress.objects.create(
            goal=goal,
            progress_percentage=progress_percentage,
            ai_feedback=ai_feedback,
            note=note,
        )