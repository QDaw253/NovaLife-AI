import json

from django.conf import settings
from groq import Groq
from rest_framework.exceptions import ValidationError

from .prompts import build_goal_plan_prompt
from .validators import GoalAIPlanResultSerializer


class GoalAIService:

    @staticmethod
    def get_client():
        return Groq(api_key = settings.GROQ_API_KEY)

    @staticmethod
    def generate_plan(goal_data):
        client = GoalAIService.get_client()
        prompt = build_goal_plan_prompt(goal_data)

        try:
            response = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_completion_tokens=2000,
            )
        except Exception as exc:
            print("GROQ ERROR:", type(exc).__name__, str(exc))
            raise ValidationError({"ai": [f"Groq lỗi: {str(exc)}"]}) from exc

        try:
            result = json.loads(response.choices[0].message.content)
        except (json.JSONDecodeError, AttributeError) as exc:
            raise ValidationError({
                "ai": ["AI trả về dữ liệu không đúng định dạng."]
            }) from exc

        serializer = GoalAIPlanResultSerializer(
            data=result,
            context={"goal_deadline": goal_data.get("deadline")},
        )

        serializer.is_valid(raise_exception=True)

        return serializer.validated_data