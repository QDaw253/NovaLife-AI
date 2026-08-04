from rest_framework import serializers

from .models import ClothingItem


class ClothingItemBaseSerializer(serializers.ModelSerializer):
    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Tên trang phục không được để trống."
            )

        return value

    def validate_color(self, value):
        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError(
                "Màu sắc không được để trống."
            )

        return value


class ClothingItemCreateSerializer(ClothingItemBaseSerializer):
    class Meta:
        model = ClothingItem
        fields = (
            "id",
            "name",
            "category",
            "color",
            "season",
            "occasion",
            "image",
            "is_favorite",
        )
        read_only_fields = ("id",)

    def create(self, validated_data):
        request = self.context["request"]

        return ClothingItem.objects.create(
            user=request.user,
            **validated_data,
        )


class ClothingItemUpdateSerializer(ClothingItemBaseSerializer):
    class Meta:
        model = ClothingItem
        fields = (
            "name",
            "category",
            "color",
            "season",
            "occasion",
            "image",
            "is_favorite",
        )


class ClothingItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = (
            "id",
            "name",
            "category",
            "color",
            "image",
            "is_favorite",
        )


class ClothingItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = (
            "id",
            "name",
            "category",
            "color",
            "season",
            "occasion",
            "image",
            "is_favorite",
            "created_at",
            "updated_at",
        )