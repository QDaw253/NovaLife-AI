import json

from django.conf import settings
from google import genai
from google.genai.errors import ServerError
from rest_framework.exceptions import ValidationError

from .prompts import build_goal_plan_prompt
from .validators import GoalAIPlanResultSerializer


class GoalAIService:

    @staticmethod
    def get_client():
        return genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    @staticmethod
    def generate_plan(goal_data):
        client = GoalAIService.get_client()

        prompt = build_goal_plan_prompt(goal_data)

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
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

        try:
            result = json.loads(response.text)
        except json.JSONDecodeError as exc:
            raise ValidationError(
                {
                    "ai": [
                        "AI trả về dữ liệu không đúng định dạng."
                    ]
                }
            ) from exc

        serializer = GoalAIPlanResultSerializer(
            data=result,
            context={
                "goal_deadline": goal_data.get("deadline"),
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        return serializer.validated_data