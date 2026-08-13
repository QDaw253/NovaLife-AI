from django.conf import settings
from django.db import models

class ClothingItem(models.Model):
    class Category(models.TextChoices):
        TOP = "top", "Áo"
        BOTTOM = "bottom", "Quần"
        SHOES = "shoes", "Giày"
        OUTERWEAR = "outerwear", "Áo khoác"
        ACCESSORY = "accessory", "Phụ kiện"

    class Season(models.TextChoices):
        SPRING = "spring", "Mùa xuân"
        SUMMER = "summer", "Mùa hè"
        AUTUMN = "autumn", "Mùa thu"
        WINTER = "winter", "Mùa đông"
        ALL_SEASON = "all_season", "Quanh năm"

    class Occasion(models.TextChoices):
        CASUAL = "casual", "Hằng ngày"
        WORK = "work", "Đi làm"
        SPORT = "sport", "Thể thao"
        PARTY = "party", "Tiệc"
        FORMAL = "formal", "Trang trọng"
        VERSATILE = "versatile", "Đa dụng"

    COLOR_CHOICES = [
        ("white", "Trắng"),
        ("black", "Đen"),
        ("gray", "Xám"),
        ("blue", "Xanh dương"),
        ("green", "Xanh lá"),
        ("red", "Đỏ"),
        ("yellow", "Vàng"),
        ("orange", "Cam"),
        ("pink", "Hồng"),
        ("purple", "Tím"),
        ("brown", "Nâu"),
        ("beige", "Be"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="clothing_items",
    )

    name = models.CharField(
        max_length=255,
    )

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
    )

    color = models.CharField(
        max_length=100,
        choices=COLOR_CHOICES,
    )

    season = models.CharField(
        max_length=20,
        choices=Season.choices,
        default=Season.ALL_SEASON,
    )

    occasion = models.CharField(
        max_length=20,
        choices=Occasion.choices,
        default=Occasion.VERSATILE,
    )

    image = models.ImageField(
        upload_to="wardrobe/",
    )

    is_favorite = models.BooleanField(
        default=False,
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
        verbose_name = "Trang phục"
        verbose_name_plural = "Trang phục"

    def __str__(self):
        return self.name