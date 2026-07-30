from rest_framework.routers import DefaultRouter

from .views import GoalViewSet, TaskViewSet

router = DefaultRouter()

router.register(
    "",
    GoalViewSet,
    basename="goal",
)

router.register(
    r"tasks",
    TaskViewSet,
    basename="task",
)

urlpatterns = router.urls

