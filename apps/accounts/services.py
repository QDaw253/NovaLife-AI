from django.db import transaction

from .serializers import RegisterSerializer

class AuthService:
    @staticmethod
    def register(data):
        serializer = RegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            user = serializer.save()
        return user
           