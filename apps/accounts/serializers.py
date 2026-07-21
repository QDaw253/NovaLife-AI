from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
    
    """
    Trả thông tin người dùng.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
        )
        read_only_fields = fields

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User

        fields = (
            "username",
            "email",
            "password",
        )
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }
def validate(self, attrs):
    password = attrs.get("password")
    confirm_password = attrs.get("confirm_password")
    if password != confirm_password:
        raise serializers.ValidationError({
    "confirm_password": "Mật khẩu xác nhận không khớp."
})
    return attrs