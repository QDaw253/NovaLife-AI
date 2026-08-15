import json

from django.conf import settings
from google import genai
from google.genai import types
from google.genai.errors import (
    ClientError,
    ServerError,
)
from rest_framework.exceptions import ValidationError

from .models import ClothingItem
from .prompts import (
    WARDROBE_ANALYZE_PROMPT,
    build_outfit_recommendation_prompt,
)
from .serializers import (
    ClothingAnalysisResultSerializer,
    ClothingItemListSerializer,
    OutfitRecommendationResultSerializer,
)


# =========================================================
# GEMINI COMMON SERVICE
# =========================================================

class GeminiService:

    @staticmethod
    def get_client():
        return genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    @staticmethod
    def generate_json(*, contents):
        client = GeminiService.get_client()

        # =========================================
        # CALL GEMINI
        # =========================================

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
            )

        # =========================================
        # GEMINI CLIENT ERROR
        # Ví dụ:
        # - 429 RESOURCE_EXHAUSTED
        # - quota / rate limit
        # =========================================

        except ClientError as exc:

            status_code = getattr(
                exc,
                "code",
                None,
            )

            if status_code is None:
                status_code = getattr(
                    exc,
                    "status_code",
                    None,
                )

            if status_code == 429:
                raise ValidationError(
                    {
                        "ai": [
                            "AI đang tạm đạt giới hạn "
                            "sử dụng. Vui lòng đợi một "
                            "lúc rồi thử lại."
                        ]
                    }
                ) from exc

            raise ValidationError(
                {
                    "ai": [
                        "Không thể kết nối đến dịch vụ AI. "
                        "Vui lòng thử lại sau."
                    ]
                }
            ) from exc

        # =========================================
        # GEMINI SERVER ERROR
        # =========================================

        except ServerError as exc:
            raise ValidationError(
                {
                    "ai": [
                        "Dịch vụ AI hiện đang quá tải. "
                        "Vui lòng thử lại sau."
                    ]
                }
            ) from exc

        # =========================================
        # PARSE JSON
        # =========================================

        try:
            result = json.loads(
                response.text,
            )

        except json.JSONDecodeError as exc:
            raise ValidationError(
                {
                    "ai": [
                        "AI trả về dữ liệu "
                        "không đúng định dạng JSON."
                    ]
                }
            ) from exc

        return result


# =========================================================
# AI VISION
# =========================================================

class ClothingVisionService:

    @staticmethod
    def analyze_image(*, image):

        # =========================================
        # PREPARE IMAGE
        # =========================================

        image_bytes = image.read()

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=image.content_type,
        )

        # =========================================
        # CALL GEMINI
        # =========================================

        result = GeminiService.generate_json(
            contents=[
                image_part,
                WARDROBE_ANALYZE_PROMPT,
            ],
        )

        # =========================================
        # VALIDATE AI RESULT
        # =========================================

        serializer = ClothingAnalysisResultSerializer(
            data=result,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        return serializer.validated_data


# =========================================================
# AI OUTFIT
# =========================================================

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
        request,
    ):

        # =========================================
        # GET ACTIVE WARDROBE ITEMS
        # =========================================

        wardrobe_items = list(
            OutfitRecommendationService
            .get_wardrobe_items(
                user=user,
            )
        )

        # =========================================
        # EMPTY WARDROBE
        # =========================================

        if not wardrobe_items:
            return {
                "status": "cannot_recommend",
                "reason": "insufficient_items",
                "item_ids": [],
                "explanation": None,
            }

        # =========================================
        # BUILD PROMPT
        # =========================================

        prompt = build_outfit_recommendation_prompt(
            occasion=occasion,
            season=season,
            wardrobe_items=wardrobe_items,
        )

        # =========================================
        # CALL GEMINI
        # =========================================

        result = GeminiService.generate_json(
            contents=prompt,
        )

        # =========================================
        # VALIDATE AI RESULT
        # =========================================

        serializer = (
            OutfitRecommendationResultSerializer(
                data=result,
            )
        )

        serializer.is_valid(
            raise_exception=True,
        )

        validated_data = serializer.validated_data

        # =========================================
        # SUCCESS
        # =========================================

        if validated_data["status"] == "success":

            valid_item_ids = {
                item["id"]
                for item in wardrobe_items
            }

            recommended_item_ids = set(
                validated_data["item_ids"]
            )

            # =====================================
            # DATA INTEGRITY CHECK
            # =====================================

            if not recommended_item_ids.issubset(
                valid_item_ids
            ):
                raise ValidationError(
                    {
                        "ai": [
                            "AI trả về trang phục "
                            "không tồn tại trong tủ đồ."
                        ]
                    }
                )

            # =====================================
            # LOAD RECOMMENDED ITEMS
            # =====================================

            recommended_items = (
                ClothingItem.objects.filter(
                    user=user,
                    is_active=True,
                    id__in=validated_data[
                        "item_ids"
                    ],
                )
            )

            # =====================================
            # PRESERVE AI ORDER
            # =====================================

            items_by_id = {
                item.id: item
                for item in recommended_items
            }

            ordered_items = [
                items_by_id[item_id]
                for item_id
                in validated_data["item_ids"]
            ]

            # =====================================
            # SERIALIZE ITEMS
            # =====================================

            item_serializer = (
                ClothingItemListSerializer(
                    ordered_items,
                    many=True,
                    context={
                        "request": request,
                    },
                )
            )

            validated_data["items"] = (
                item_serializer.data
            )

        return validated_data