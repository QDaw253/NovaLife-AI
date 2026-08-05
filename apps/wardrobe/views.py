from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from .models import ClothingItem
from .serializers import (
    ClothingItemCreateSerializer,
    ClothingItemDetailSerializer,
    ClothingItemListSerializer,
    ClothingItemUpdateSerializer,
)


class ClothingItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ClothingItem.objects.filter(
            user=self.request.user,
            is_active=True,
        )

    def get_serializer_class(self):
        if self.action == "list":
            return ClothingItemListSerializer

        if self.action == "retrieve":
            return ClothingItemDetailSerializer

        if self.action in ("update", "partial_update"):
            return ClothingItemUpdateSerializer

        return ClothingItemCreateSerializer

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        item.is_active = False
        item.save(update_fields=["is_active", "updated_at",])

        return Response(status=status.HTTP_204_NO_CONTENT,)
