import json

from django.conf import settings
from google import genai
from google.genai import types
from google.genai.errors import ServerError
from rest_framework.exceptions import ValidationError

from .prompts import WARDROBE_ANALYZE_PROMPT, build_outfit_recommendation_prompt
from .serializers import ClothingAnalysisResultSerializer, OutfitRecommendationResultSerializer, ClothingItemListSerializer
from .models import ClothingItem



class ClothingVisionService:

    @staticmethod
    def get_client():
        return genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    @staticmethod
    def analyze_image(*, image):
        client = ClothingVisionService.get_client()

        image_bytes = image.read()

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=image.content_type,
        )

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[
                    image_part,
                    WARDROBE_ANALYZE_PROMPT,
                ],
            )

        except ServerError as exc:
            raise ValidationError(
                {
                    "ai": [
                        "Dịch vụ AI hiện đang quá tải. "
                        "Vui lòng thử lại sau."
                    ]
                }
            ) from exc

        result = json.loads(
            response.text,
        )

        serializer = ClothingAnalysisResultSerializer(
            data=result,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        return serializer.validated_data

class OutfitRecommendationService:

    @staticmethod
    def get_wardrobe_items(*, user):
        return ClothingItem.objects.filter(
            user=user,
            is_active=True,
        ).values(
            "id",
            "name",
            "category",
            "color",
            "season",
            "occasion",
        )

    @staticmethod
    def recommend(
        *,
        user,
        occasion,
        season,
    ):
        wardrobe_items = OutfitRecommendationService.get_wardrobe_items(
            user=user,
        )

        wardrobe_items = list(wardrobe_items)

        if not wardrobe_items:
            return {
                "status": "cannot_recommend",
                "reason": "insufficient_items",
                "item_ids": [],
                "explanation": None,
            }

        prompt = build_outfit_recommendation_prompt(
            occasion=occasion,
            season=season,
            wardrobe_items=wardrobe_items,
        )

        client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
            )
        except ServerError as exc:
            raise ValidationError(
                {
                    "ai": [
                        "Dịch vụ AI hiện đang quá tải. Vui lòng thử lại sau."
                    ]
                }
            ) from exc

        result = json.loads(
            response.text,
        )

        serializer = OutfitRecommendationResultSerializer(
            data=result,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = serializer.validated_data

        if validated_data["status"] == "success":
            valid_item_ids = {
                item["id"]
                for item in wardrobe_items
            }

            recommended_item_ids = set(
                validated_data["item_ids"]
            )

            if not recommended_item_ids.issubset(valid_item_ids):
                raise ValidationError(
                    {
                        "ai": [
                            "AI trả về trang phục không tồn tại trong tủ đồ."
                        ]
                    }
                )

            recommended_items = ClothingItem.objects.filter(
                user=user,
                is_active=True,
                id__in=validated_data["item_ids"],
            )

            items_by_id = {
                item.id: item
                for item in recommended_items
            }

            ordered_items = [
                items_by_id[item_id]
                for item_id in validated_data["item_ids"]
            ]

            item_serializer = ClothingItemListSerializer(
                ordered_items,
                many=True,
            )

            validated_data["items"] = item_serializer.data

        return validated_data