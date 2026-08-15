from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ClothingItem
from .serializers import (
    ClothingImageAnalyzeSerializer,
    ClothingItemCreateSerializer,
    ClothingItemDetailSerializer,
    ClothingItemListSerializer,
    ClothingItemUpdateSerializer,
    OutfitRecommendationRequestSerializer,
)
from .services import (
    ClothingVisionService,
    OutfitRecommendationService,
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

        if self.action in (
            "update",
            "partial_update",
        ):
            return ClothingItemUpdateSerializer

        return ClothingItemCreateSerializer

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()

        item.is_active = False

        item.save(
            update_fields=[
                "is_active",
                "updated_at",
            ]
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class ClothingImageAnalyzeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClothingImageAnalyzeSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        result = ClothingVisionService.analyze_image(
            image=serializer.validated_data["image"],
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )


class OutfitRecommendationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = OutfitRecommendationRequestSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        result = OutfitRecommendationService.recommend(
            user=request.user,
            occasion=serializer.validated_data["occasion"],
            season=serializer.validated_data["season"],
            request=request,
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )