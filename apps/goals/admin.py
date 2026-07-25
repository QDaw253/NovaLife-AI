from django.contrib import admin

from .models import Goal, GoalAIPlan,Milestone

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
