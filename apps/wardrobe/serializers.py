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

class ClothingImageAnalyzeSerializer(serializers.Serializer):
    """
    Kiểm tra ảnh do người dùng gửi lên để AI phân tích.
    """

    image = serializers.ImageField()


class ClothingAnalysisResultSerializer(serializers.Serializer):
    """
    Kiểm tra và chuẩn hóa kết quả do AI Vision trả về.

    Serializer hỗ trợ hai trạng thái:
    - success: phân tích thành công.
    - cannot_analyze: không thể phân tích ảnh.
    """

    STATUS_SUCCESS = "success"
    STATUS_CANNOT_ANALYZE = "cannot_analyze"

    REASON_IMAGE_TOO_BLURRY = "image_too_blurry"
    REASON_IMAGE_TOO_DARK = "image_too_dark"
    REASON_MULTIPLE_ITEMS = "multiple_items"
    REASON_NOT_CLOTHING = "not_clothing"
    REASON_OBJECT_OCCLUDED = "object_occluded"

    status = serializers.ChoiceField(
        choices=(
            STATUS_SUCCESS,
            STATUS_CANNOT_ANALYZE,
        ),
    )

    reason = serializers.ChoiceField(
        choices=(
            REASON_IMAGE_TOO_BLURRY,
            REASON_IMAGE_TOO_DARK,
            REASON_MULTIPLE_ITEMS,
            REASON_NOT_CLOTHING,
            REASON_OBJECT_OCCLUDED,
        ),
        allow_null=True,
    )

    suggested_name = serializers.CharField(
        max_length=255,
        allow_null=True,
    )

    category = serializers.ChoiceField(
        choices=ClothingItem.Category.choices,
        allow_null=True,
    )

    color = serializers.CharField(
        max_length=100,
        allow_null=True,
    )

    season = serializers.ChoiceField(
        choices=ClothingItem.Season.choices,
        allow_null=True,
    )

    occasion = serializers.ChoiceField(
        choices=ClothingItem.Occasion.choices,
        allow_null=True,
    )

    def validate_suggested_name(self, value):
        """
        Chuẩn hóa tên gợi ý nếu AI phân tích thành công.
        """

        if value is None:
            return value

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Tên gợi ý không được để trống."
            )

        return value

    def validate_color(self, value):
        """
        Chuẩn hóa màu về chữ thường.
        Ví dụ: NAVY -> navy.
        """

        if value is None:
            return value

        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError(
                "Màu sắc không được để trống."
            )

        return value

    def validate(self, attrs):
        """
        Kiểm tra tính nhất quán của toàn bộ kết quả AI.
        """

        analysis_status = attrs.get("status")
        reason = attrs.get("reason")

        result_fields = (
            "suggested_name",
            "category",
            "color",
            "season",
            "occasion",
        )

        if analysis_status == self.STATUS_SUCCESS:
            self._validate_success_result(
                attrs=attrs,
                reason=reason,
                result_fields=result_fields,
            )

        elif analysis_status == self.STATUS_CANNOT_ANALYZE:
            self._validate_failed_result(
                attrs=attrs,
                reason=reason,
                result_fields=result_fields,
            )

        return attrs

    def _validate_success_result(
        self,
        *,
        attrs,
        reason,
        result_fields,
    ):
        """
        Khi AI phân tích thành công:
        - reason phải là null.
        - Tất cả các trường kết quả phải có dữ liệu.
        """

        errors = {}

        if reason is not None:
            errors["reason"] = (
                "Reason phải là null khi phân tích thành công."
            )

        for field in result_fields:
            if attrs.get(field) is None:
                errors[field] = (
                    "Trường này không được null "
                    "khi phân tích thành công."
                )

        if errors:
            raise serializers.ValidationError(errors)

    def _validate_failed_result(
        self,
        *,
        attrs,
        reason,
        result_fields,
    ):
        """
        Khi AI không thể phân tích:
        - reason bắt buộc phải có.
        - Các trường kết quả phải là null.
        """

        errors = {}

        if reason is None:
            errors["reason"] = (
                "Phải có lý do khi không thể phân tích ảnh."
            )

        for field in result_fields:
            if attrs.get(field) is not None:
                errors[field] = (
                    "Trường này phải là null "
                    "khi không thể phân tích ảnh."
                )

        if errors:
            raise serializers.ValidationError(errors)