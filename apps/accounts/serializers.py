import re
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


import re

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True
    )

    email = serializers.EmailField(
        validators=[],
        error_messages={
            "required": "Vui lòng nhập email.",
            "blank": "Email không được để trống.",
            "invalid": "Email không đúng định dạng.",
        }
    )

    username = serializers.CharField(
        error_messages={
            "required": "Vui lòng nhập tên đăng nhập.",
            "blank": "Tên đăng nhập không được để trống.",
        }
    )

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

    def validate_username(self, value):
        value = value.strip()

        if User.objects.filter(
            username__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "Tên đăng nhập này đã được sử dụng."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(
            email__iexact=value
        ).exists():
            raise serializers.ValidationError(
                "Email này đã được sử dụng."
            )

        return value

    def validate_password(self, value):
        errors = []

        if len(value) < 8:
            errors.append(
                "Mật khẩu phải có ít nhất 8 ký tự."
            )

        if not re.search(r"[A-Z]", value):
            errors.append(
                "Mật khẩu phải có ít nhất 1 chữ cái viết hoa."
            )

        if not re.search(r"[a-z]", value):
            errors.append(
                "Mật khẩu phải có ít nhất 1 chữ cái viết thường."
            )

        if not re.search(r"\d", value):
            errors.append(
                "Mật khẩu phải có ít nhất 1 chữ số."
            )

        if not re.search(
            r"""[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];']""",
            value
        ):
            errors.append(
                "Mật khẩu phải có ít nhất 1 ký tự đặc biệt."
            )

        if errors:
            raise serializers.ValidationError(
                errors
            )

        # Giữ thêm password validation của Django
        validate_password(value)

        return value

    def validate(self, attrs):
        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError({
                "confirm_password":
                    "Mật khẩu xác nhận không khớp."
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop(
            "confirm_password"
        )

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
    

