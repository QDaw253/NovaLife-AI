from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

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
            "confirm_password",
        )
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }
    def validate(self, attrs):
     
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "Mật khẩu xác nhận không khớp."}
            )

        validate_password(attrs["password"])

        return attrs

    #sử dụng create_user sẽ mã hóa mk
    #còn sử dụng create.object thì để mk ở dạng thô dễ bị lộ

    def create(self, validated_data): 
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    

