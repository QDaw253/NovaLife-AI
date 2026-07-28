from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
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
    class Difficulty(models.TextChoices):
        EASY = "easy", "Dễ"
        MEDIUM = "medium", "Trung bình"
        HARD = "hard", "Khó"
    goal = models.OneToOneField(
        Goal,
        on_delete=models.CASCADE,
        related_name="ai_plan",
    )

    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
        
    )

    estimated_duration = models.CharField(
        max_length=100,
    )

    recommended_hours_per_week = models.PositiveIntegerField(
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
        verbose_name = "Kế hoạch AI"
        verbose_name_plural = "Kế hoạch AI"

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
        verbose_name = "Cột mốc"
        verbose_name_plural = "Các cột mốc"

    def __str__(self):
        return f"{self.order}. {self.title}"

class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Chưa bắt đầu"
        IN_PROGRESS = "in_progress", "Đang thực hiện"
        COMPLETED = "completed", "Hoàn thành"
        SKIPPED = "skipped", "Đã bỏ qua"

    class Priority(models.TextChoices):
        LOW = "low", "Thấp"
        MEDIUM = "medium", "Trung bình"
        HIGH = "high", "Cao"

    class DifficultyFeedback(models.TextChoices):
        VERY_EASY = "very_easy", "Rất dễ"
        EASY = "easy", "Dễ"
        NORMAL = "normal", "Vừa sức"
        HARD = "hard", "Khó"
        VERY_HARD = "very_hard", "Rất khó"

    milestone = models.ForeignKey(
        Milestone,
        on_delete=models.CASCADE,
        related_name="tasks",
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

    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    deadline = models.DateField(
        null=True,
        blank=True,
    )

    estimated_minutes = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    order = models.PositiveIntegerField(
        default=1,
    )

    difficulty_feedback = models.CharField(
        max_length=20,
        choices=DifficultyFeedback.choices,
        null=True,
        blank=True,
    )

    feedback_note = models.TextField(
        blank=True,
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
                fields=["milestone", "order"],
                name="unique_task_order_per_milestone",
            )
        ]
        verbose_name = "Nhiệm vụ"
        verbose_name_plural = "Các nhiệm vụ"

    def __str__(self):
        return f"{self.order}. {self.title}"

class GoalProgress(models.Model):
    goal = models.ForeignKey(
        Goal,
        on_delete=models.CASCADE,
        related_name="progress_history",
    )

    progress_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    ai_feedback = models.TextField(
        blank=True,
    )

    note = models.TextField(
        blank=True,
    )

    recorded_at = models.DateTimeField(
        auto_now_add=True,
    )

    created_at = models.DateTimeField()

    class Meta:
        ordering = ["-recorded_at", "-created_at"]
        verbose_name = "Tiến độ mục tiêu"
        verbose_name_plural = "Lịch sử tiến độ mục tiêu"

    def __str__(self):
        return (
            f"{self.goal.title} - "
            f"{self.progress_percentage}%"
        )

