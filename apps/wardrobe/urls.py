from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ClothingImageAnalyzeAPIView,
    ClothingItemViewSet,
    OutfitRecommendationAPIView
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
    path(
        "recommend-outfit/",
        OutfitRecommendationAPIView.as_view(),
        name="recommend-outfit",
    ),
]

urlpatterns += router.urls