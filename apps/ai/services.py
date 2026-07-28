from google import genai
from django.conf import settings
from .prompt import build_goal_plan_prompt


class GoalAIService:

    @staticmethod
    def get_client():
        return genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    @staticmethod
    def generate_plan(goal_data):
        pass