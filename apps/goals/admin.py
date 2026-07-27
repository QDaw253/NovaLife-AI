from django.contrib import admin

from .models import Goal, GoalAIPlan,Milestone, Task, GoalProgress

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = (
         "id",
        "title",
        "user",
        "category",
        "priority",
        "status",
        "deadline",
        "created_at",
    )

    list_filter = (
        "category",
        "priority",
        "status",
    )

    search_fields = (
        "title",
        "description",
        "user__email",
    )

    ordering = (
        "-created_at",
    )

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "goal",
        "order",
        "title",
        "status",
        "deadline",
        "created_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "title",
        "description",
        "goal__title",
    )

    ordering = (
        "goal",
        "order",
    )

@admin.register(GoalAIPlan)
class GoalAIPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "goal",
        "difficulty",
        "estimated_duration",
        "recommended_hours_per_week",
        "created_at",
    )

    search_fields = (
        "goal__title",
        "difficulty",
        "estimated_duration",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "milestone",
        "status",
        "priority",
        "deadline",
        "estimated_minutes",
        "order",
    )

    list_filter = (
        "status",
        "priority",
        "difficulty_feedback",
    )

    search_fields = (
        "title",
        "description",
        "milestone__title",
        "milestone__goal__title",
    )

    ordering = (
        "milestone",
        "order",
    )

@admin.register(GoalProgress)
class GoalProgressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "goal",
        "progress_percentage",
        "recorded_at",
        "created_at",
    )

    search_fields = (
        "goal__title",
        "ai_feedback",
        "note",
    )

    ordering = (
        "-recorded_at",
    )

    readonly_fields = (
        "created_at",
    )
