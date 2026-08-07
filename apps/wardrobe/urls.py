from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ClothingImageAnalyzeAPIView,
    ClothingItemViewSet,
)

router = DefaultRouter()

router.register(
    "items",
    ClothingItemViewSet,
    basename="wardrobe",
)

urlpatterns = [
    path(
        "analyze-image/",
        ClothingImageAnalyzeAPIView.as_view(),
        name="analyze-image",
    ),
]

urlpatterns += router.urls