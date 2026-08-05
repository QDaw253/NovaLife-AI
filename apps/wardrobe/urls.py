from rest_framework.routers import DefaultRouter

from .views import ClothingItemViewSet

router = DefaultRouter()

router.register(
    "items",
    ClothingItemViewSet,
    basename="wardrobe",
)

urlpatterns = router.urls