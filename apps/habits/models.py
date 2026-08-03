from django.db import models
from django.conf import settings

class Habit(models.Model):
    class Frequency(models.TextChoices):
        DAILY = "daily", "Hằng ngày"
        WEEKLY = "weekly", "Hằng tuần"
        MONTHLY = "monthly","Hằng tháng"

    class Category(models.TextChoices):
        HEALTH = "health", "Sức khỏe"
        FITNESS = "fitness", "Thể hình"
        STUDY = "study", "Học tập"
        PERSONAL = "personal", "Cá nhân"
        OTHER = "other", "Khác"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="habits",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
    )

    frequency = models.CharField(
        max_length=20,
        choices=Frequency.choices,
        default=Frequency.DAILY,
    )

    target_value = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=1,
)

    unit = models.CharField(
        max_length=50,
        default="lần",
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    reminder_time = models.TimeField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Thói quen"
        verbose_name_plural = "Thói quen"

    def __str__(self):
        return self.title

class HabitLog(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Chưa hoàn thành"
        COMPLETED = "completed", "Hoàn thành"
        SKIPPED = "skipped", "Bỏ qua"

    habit = models.ForeignKey(
        Habit,
        on_delete=models.CASCADE,
        related_name="logs",
    )

    date = models.DateField()

    value = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    note = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-date", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["habit", "date"],
                name="unique_habit_log_per_day",
            )
        ]
        verbose_name = "Nhật ký thói quen"
        verbose_name_plural = "Nhật ký thói quen"

    def __str__(self):
        return f"{self.habit.title} - {self.date}"
