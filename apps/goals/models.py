from django.db import models
from django.conf import settings

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
        LOW ="low","Thấp",
        MEDIUM = "medium","Trung bình",
        HIGH = "high", "cao",
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
        max_length=225,
        blank=True,

    )

    description = models.TextField(
        blank=True,
    )

    category =models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER,

    )

    priority= models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
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
        auto_now=True,
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
