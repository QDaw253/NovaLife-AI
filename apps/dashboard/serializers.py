from rest_framework import serializers


class GoalSummarySerializer(serializers.Serializer):
    total = serializers.IntegerField()
    completed = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    completion_rate = serializers.FloatField()


class HabitSummarySerializer(serializers.Serializer):
    active = serializers.IntegerField()
    completed_today = serializers.IntegerField()
    completion_rate = serializers.FloatField()


class DashboardSerializer(serializers.Serializer):
    goals = GoalSummarySerializer()
    habits = HabitSummarySerializer()