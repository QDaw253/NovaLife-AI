import json

from django.conf import settings
from google import genai
from google.genai import types
from google.genai.errors import ServerError
from rest_framework.exceptions import ValidationError

from .prompts import WARDROBE_ANALYZE_PROMPT
from .serializers import ClothingAnalysisResultSerializer


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