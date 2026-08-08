from django.db import transaction
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .serializers import(LoginSerializer, RegisterSerializer, LogoutSerializer)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError


class AuthService:
    @staticmethod
    def register(data):
        serializer = RegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():

            user = serializer.save()
        
        return user
    @staticmethod
    def login(data):
        serializer = LoginSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        user = authenticate(
            username = validated_data["email"],
            password = validated_data["password"],
        )

        if user is None:
            raise AuthenticationFailed(
                "Email hoặc mật khẩu không đúng."
            )
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        return {
            "user": user,
            "access": str(access),
            "refresh": str(refresh),
        }

    @staticmethod
    def me(user):
        return user

    @staticmethod
    def logout(data):
        serializer = LogoutSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            RefreshToken(
                validated_data["refresh"]
            ).blacklist()

        except TokenError as exc:
            raise ValidationError(
                {
                    "refresh": [
                        "Refresh token không hợp lệ hoặc đã hết hạn."
                    ]
                }
            ) from exc

        return True



           