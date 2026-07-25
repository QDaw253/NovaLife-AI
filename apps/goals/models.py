from django.conf import settings
from django.db import models


class Goal(models.Model):
    class Category(models.TextChoices):
        STUDY = "study", "Học tập"
        HEALTH = "health", "Sức khỏe"
        FITNESS = "fitness", "Thể hình"
        CAREER = "career", "Sự nghiệp"
        FINANCE = "finance", "Tài chính"
        RELATIONSHIP = "relationship", "Mối quan hệ"
        PERSONAL_DEVELOPMENT = (
            "personal_development",
            "Phát triển bản thân",
        )
        OTHER = "other", "Khác"

    class Priority(models.TextChoices):
        LOW = "low", "Thấp"
        MEDIUM = "medium", "Trung bình"
        HIGH = "high", "Cao"

    class Status(models.TextChoices):
        PENDING = "pending", "Chưa bắt đầu"
        IN_PROGRESS = "in_progress", "Đang thực hiện"
        PAUSED = "paused", "Tạm dừng"
        COMPLETED = "completed", "Hoàn thành"
        CANCELLED = "cancelled", "Đã hủy"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER,
    )

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    deadline = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Mục tiêu"
        verbose_name_plural = "Mục tiêu"

    def __str__(self):
        return self.title


class GoalAIPlan(models.Model):
    goal = models.OneToOneField(
        Goal,
        on_delete=models.CASCADE,
        related_name="ai_plan",
    )

    difficulty = models.CharField(
        max_length=20,
    )

    estimated_duration = models.CharField(
        max_length=100,
    )

    recommended_hours_per_week = models.PositiveIntegerField()

    plan_data = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"AI Plan - {self.goal.title}"

class Milestone(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Chưa bắt đầu"
        IN_PROGRESS = "in_progress", "Đang thực hiện"
        COMPLETED = "completed", "Hoàn thành"

    goal = models.ForeignKey(
        Goal,
        on_delete=models.CASCADE,
        related_name="milestones",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    deadline = models.DateField(
        null=True,
        blank=True,
    )

    order = models.PositiveIntegerField(
        default=1,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["order", "created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["goal", "order"],
                name="unique_milestone_order_per_goal",
            )
        ]

    def __str__(self):
        return f"{self.order}. {self.title}"