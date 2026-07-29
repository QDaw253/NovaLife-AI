import json

from django.conf import settings
from google import genai

from .prompts import build_goal_plan_prompt


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

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )

        return json.loads(response.text)