import json
import time
import requests
from django.conf import settings
from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError
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


class GroqService:

    @staticmethod
    def generate_json(*, prompt_text):
        groq_api_key = getattr(settings, "GROQ_API_KEY", None)

        if not groq_api_key:
            raise ValidationError(
                {"ai": ["GROQ_API_KEY chưa được cấu hình trong .env."]}
            )

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": getattr(settings, "GROQ_MODEL", "llama-3.3-70b-versatile"),
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an expert AI fashion stylist for NovaLife. "
                        "Always respond with raw JSON only, matching the exact schema requested."
                    ),
                },
                {"role": "user", "content": prompt_text},
            ],
            "response_format": {"type": "json_object"},
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=15)

            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return json.loads(content)

            if response.status_code == 429:
                raise ValidationError(
                    {"ai": ["Groq API đang tạm thời đạt giới hạn. Vui lòng thử lại sau giây lát."]}
                )

            raise ValidationError(
                {"ai": [f"Lỗi kết nối Groq API (Mã lỗi: {response.status_code})."]}
            )

        except json.JSONDecodeError as exc:
            raise ValidationError(
                {"ai": ["Groq AI trả về dữ liệu không đúng định dạng JSON."]}
            ) from exc

        except requests.RequestException as exc:
            raise ValidationError(
                {"ai": ["Không thể kết nối đến máy chủ Groq AI. Vui lòng kiểm tra mạng."]}
            ) from exc


class GeminiService:

    @staticmethod
    def get_api_keys():
        keys = getattr(settings, "GEMINI_API_KEYS", [])
        if not keys and hasattr(settings, "GEMINI_API_KEY"):
            keys = [settings.GEMINI_API_KEY]
        return [k for k in keys if k]

    @staticmethod
    def generate_json(*, contents):
        api_keys = GeminiService.get_api_keys()

        if not api_keys:
            raise ValidationError(
                {"ai": ["Cấu hình GEMINI_API_KEY chưa hợp lệ trong .env."]}
            )

        last_exception = None

        for api_key in api_keys:
            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model=getattr(settings, "GEMINI_MODEL", "gemini-2.5-flash-lite"),
                    contents=contents,
                )
                return json.loads(response.text)

            except (ClientError, ServerError) as exc:
                last_exception = exc
                continue

            except json.JSONDecodeError as exc:
                raise ValidationError(
                    {"ai": ["Gemini AI trả về dữ liệu không đúng định dạng JSON."]}
                ) from exc

        status_code = getattr(last_exception, "code", getattr(last_exception, "status_code", None))

        if status_code == 429:
            raise ValidationError(
                {"ai": ["Gemini AI đang tạm đạt giới hạn lượt gọi. Vui lòng thử lại sau ít phút."]}
            )

        raise ValidationError(
            {"ai": ["Dịch vụ phân tích hình ảnh AI hiện đang quá tải. Vui lòng thử lại sau."]}
        ) from last_exception


class ClothingVisionService:

    @staticmethod
    def analyze_image(*, image):
        image_bytes = image.read()

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=image.content_type,
        )

        result = GeminiService.generate_json(
            contents=[
                image_part,
                WARDROBE_ANALYZE_PROMPT,
            ],
        )

        serializer = ClothingAnalysisResultSerializer(data=result)
        serializer.is_valid(raise_exception=True)
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
    def recommend(*, user, occasion, season, request):
        wardrobe_items = list(
            OutfitRecommendationService.get_wardrobe_items(user=user)
        )

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

        # Sử dụng GroqService cho tính năng Đề xuất Outfit
        result = GroqService.generate_json(prompt_text=prompt)

        serializer = OutfitRecommendationResultSerializer(data=result)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        if validated_data["status"] == "success":
            valid_item_ids = {item["id"] for item in wardrobe_items}
            recommended_item_ids = set(validated_data["item_ids"])

            if not recommended_item_ids.issubset(valid_item_ids):
                raise ValidationError(
                    {"ai": ["AI trả về trang phục không tồn tại trong tủ đồ."]}
                )

            recommended_items = ClothingItem.objects.filter(
                user=user,
                is_active=True,
                id__in=validated_data["item_ids"],
            )

            items_by_id = {item.id: item for item in recommended_items}
            ordered_items = [
                items_by_id[item_id]
                for item_id in validated_data["item_ids"]
            ]

            item_serializer = ClothingItemListSerializer(
                ordered_items,
                many=True,
                context={"request": request},
            )
            validated_data["items"] = item_serializer.data

        return validated_data