from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from rest_framework import serializers

from apps.ai.services import GoalAIService

from .models import (
    Goal,
    GoalAIPlan,
    GoalProgress,
    Milestone,
    Task,
)


# =========================================================
# GOAL SERVICE
# =========================================================

class GoalService:

    # Các field làm thay đổi bản chất AI roadmap
    PLAN_AFFECTING_FIELDS = {
        "title",
        "description",
        "category",
        "deadline",
    }

    # =====================================================
    # CREATE GOAL
    # =====================================================

    @staticmethod
    def create_goal(user, goal_data):

        return Goal.objects.create(
            user=user,
            **goal_data,
        )

    # =====================================================
    # CREATE AI PLAN
    # =====================================================

    @staticmethod
    def create_ai_plan(goal, plan_data):

        return GoalAIPlan.objects.create(
            goal=goal,

            difficulty=plan_data["difficulty"],

            estimated_duration=(
                plan_data["estimated_duration"]
            ),

            recommended_hours_per_week=(
                plan_data.get(
                    "recommended_hours_per_week"
                )
            ),
        )

    # =====================================================
    # CREATE TASKS
    # =====================================================

    @staticmethod
    def create_tasks(
        milestone,
        tasks_data,
    ):

        for task_data in tasks_data:

            Task.objects.create(
                milestone=milestone,
                **task_data,
            )

    # =====================================================
    # CREATE MILESTONES
    # =====================================================

    @staticmethod
    def create_milestones(
        goal,
        milestones_data,
    ):

        for milestone_data in milestones_data:

            milestone_payload = (
                milestone_data.copy()
            )

            tasks_data = milestone_payload.pop(
                "tasks",
                [],
            )

            milestone = (
                Milestone.objects.create(
                    goal=goal,
                    **milestone_payload,
                )
            )

            GoalService.create_tasks(
                milestone=milestone,
                tasks_data=tasks_data,
            )

    # =====================================================
    # CREATE GOAL WITH AI PLAN
    # =====================================================

    @staticmethod
    def create_goal_with_plan(
        user,
        goal_data,
    ):

        # AI được gọi trước transaction.
        # Nếu AI lỗi thì không tạo Goal rỗng.
        ai_plan_data = (
            GoalAIService.generate_plan(
                goal_data
            )
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

    # =====================================================
    # CHECK PLAN CHANGES
    # =====================================================

    @staticmethod
    def get_plan_affecting_changes(
        goal,
        goal_data,
    ):

        changed_fields = []

        for field in (
            GoalService.PLAN_AFFECTING_FIELDS
        ):

            if field not in goal_data:
                continue

            old_value = getattr(
                goal,
                field,
            )

            new_value = goal_data[field]

            if old_value != new_value:
                changed_fields.append(field)

        return changed_fields

    # =====================================================
    # CHECK COMPLETED TASKS
    # =====================================================

    @staticmethod
    def has_completed_tasks(goal):

        return Task.objects.filter(
            milestone__goal=goal,
            status=Task.Status.COMPLETED,
        ).exists()

    # =====================================================
    # DELETE OLD ROADMAP
    # =====================================================

    @staticmethod
    def delete_old_plan(goal):

        # Xóa milestones.
        # Tasks sẽ cascade theo milestone nếu model
        # hiện tại dùng on_delete=models.CASCADE.
        goal.milestones.all().delete()

        # GoalAIPlan đang là relation ai_plan.
        # Xóa plan cũ nếu tồn tại.
        try:
            goal.ai_plan.delete()

        except GoalAIPlan.DoesNotExist:
            pass

    # =====================================================
    # REGENERATE PLAN
    # =====================================================

    @staticmethod
    def regenerate_plan(
        goal,
        goal_data,
    ):

        # Tạo payload đầy đủ từ dữ liệu mới
        # + dữ liệu hiện tại của Goal.
        plan_input = {
            "title": goal_data.get(
                "title",
                goal.title,
            ),

            "description": goal_data.get(
                "description",
                goal.description,
            ),

            "category": goal_data.get(
                "category",
                goal.category,
            ),

            "priority": goal_data.get(
                "priority",
                goal.priority,
            ),

            "deadline": goal_data.get(
                "deadline",
                goal.deadline,
            ),
        }

        # Gọi AI trước khi xóa roadmap cũ.
        # Nếu Gemini lỗi thì roadmap cũ vẫn còn.
        ai_plan_data = (
            GoalAIService.generate_plan(
                plan_input
            )
        )

        GoalService.delete_old_plan(
            goal
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

    # =====================================================
    # UPDATE GOAL
    # =====================================================

    @staticmethod
    def update_goal(
        goal,
        goal_data,
    ):

        changed_plan_fields = (
            GoalService
            .get_plan_affecting_changes(
                goal=goal,
                goal_data=goal_data,
            )
        )

        plan_changed = bool(
            changed_plan_fields
        )

        # -------------------------------------------------
        # Nếu roadmap thay đổi nhưng user đã có progress
        # thì KHÔNG được tự xóa roadmap.
        # -------------------------------------------------

        if (
            plan_changed
            and GoalService.has_completed_tasks(
                goal
            )
        ):
            raise serializers.ValidationError({
                "roadmap": [
                    (
                        "Mục tiêu này đã có tiến độ. "
                        "Bạn không thể thay đổi tên, "
                        "mô tả, danh mục hoặc thời hạn "
                        "vì những thay đổi này sẽ làm "
                        "thay đổi lộ trình hiện tại. "
                        "Bạn vẫn có thể thay đổi "
                        "mức độ ưu tiên."
                    )
                ]
            })

        # -------------------------------------------------
        # Nếu plan bị ảnh hưởng nhưng chưa có progress,
        # generate AI trước.
        # -------------------------------------------------

        ai_plan_data = None

        if plan_changed:

            plan_input = {
                "title": goal_data.get(
                    "title",
                    goal.title,
                ),

                "description": goal_data.get(
                    "description",
                    goal.description,
                ),

                "category": goal_data.get(
                    "category",
                    goal.category,
                ),

                "priority": goal_data.get(
                    "priority",
                    goal.priority,
                ),

                "deadline": goal_data.get(
                    "deadline",
                    goal.deadline,
                ),
            }

            ai_plan_data = (
                GoalAIService.generate_plan(
                    plan_input
                )
            )

        # -------------------------------------------------
        # DB transaction
        # -------------------------------------------------

        with transaction.atomic():

            # Update Goal
            for field, value in (
                goal_data.items()
            ):
                setattr(
                    goal,
                    field,
                    value,
                )

            goal.save()

            # ---------------------------------------------
            # Regenerate roadmap nếu cần
            # ---------------------------------------------

            if plan_changed:

                GoalService.delete_old_plan(
                    goal
                )

                GoalService.create_ai_plan(
                    goal=goal,
                    plan_data=ai_plan_data,
                )

                GoalService.create_milestones(
                    goal=goal,

                    milestones_data=(
                        ai_plan_data[
                            "milestones"
                        ]
                    ),
                )

                # Vì roadmap mới hoàn toàn
                # nên status trở lại pending.
                goal.status = (
                    Goal.Status.PENDING
                )

                goal.save(
                    update_fields=[
                        "status",
                    ]
                )

                GoalProgressService.create_snapshot(
                    goal=goal,

                    ai_feedback=(
                        "Kế hoạch AI đã được tạo lại "
                        "do thông tin mục tiêu thay đổi."
                    ),
                )

            return goal


# =========================================================
# GOAL PROGRESS SERVICE
# =========================================================

class GoalProgressService:

    @staticmethod
    def calculate_progress(
        goal: Goal,
    ) -> Decimal:

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

    # =====================================================
    # SNAPSHOT
    # =====================================================

    @staticmethod
    @transaction.atomic
    def create_snapshot(
        goal: Goal,
        ai_feedback: str = "",
        note: str = "",
    ) -> GoalProgress:

        progress_percentage = (
            GoalProgressService
            .calculate_progress(
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


# =========================================================
# TASK SERVICE
# =========================================================

class TaskService:

    # =====================================================
    # UPDATE TASK STATUS
    # =====================================================

    @staticmethod
    @transaction.atomic
    def update_task_status(
        task: Task,
        status: str,
    ) -> Task:

        task.status = status

        task.save(
            update_fields=[
                "status",
            ]
        )

        TaskService.update_milestone_status(
            milestone=task.milestone
        )

        TaskService.update_goal_status(
            goal=task.milestone.goal
        )

        GoalProgressService.create_snapshot(
            goal=task.milestone.goal,

            note=(
                "Cập nhật trạng thái task: "
                f"{task.title}"
            ),
        )

        return task

    # =====================================================
    # UPDATE MILESTONE STATUS
    # =====================================================

    @staticmethod
    def update_milestone_status(
        milestone: Milestone,
    ) -> Milestone:

        tasks = milestone.tasks.all()

        total_tasks = tasks.count()

        completed_tasks = tasks.filter(
            status=Task.Status.COMPLETED
        ).count()

        if (
            total_tasks > 0
            and completed_tasks
            == total_tasks
        ):
            milestone.status = (
                Milestone.Status.COMPLETED
            )

        elif tasks.exclude(
            status=Task.Status.PENDING
        ).exists():

            milestone.status = (
                Milestone.Status.IN_PROGRESS
            )

        else:
            milestone.status = (
                Milestone.Status.PENDING
            )

        milestone.save(
            update_fields=[
                "status",
            ]
        )

        return milestone

    # =====================================================
    # UPDATE GOAL STATUS
    # =====================================================

    @staticmethod
    def update_goal_status(
        goal: Goal,
    ) -> Goal:

        milestones = goal.milestones.all()

        total_milestones = (
            milestones.count()
        )

        completed_milestones = (
            milestones.filter(
                status=(
                    Milestone.Status.COMPLETED
                )
            ).count()
        )

        if (
            total_milestones > 0
            and completed_milestones
            == total_milestones
        ):
            goal.status = (
                Goal.Status.COMPLETED
            )

        elif milestones.exclude(
            status=Milestone.Status.PENDING
        ).exists():

            goal.status = (
                Goal.Status.IN_PROGRESS
            )

        else:
            goal.status = (
                Goal.Status.PENDING
            )

        goal.save(
            update_fields=[
                "status",
            ]
        )

        return goal