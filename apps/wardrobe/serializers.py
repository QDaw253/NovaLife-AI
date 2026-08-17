from rest_framework import serializers

from .models import ClothingItem


# =========================================================
# COMMON VALIDATION
# =========================================================

def validate_clothing_name(value):
    value = value.strip()

    if not value:
        raise serializers.ValidationError("Tên trang phục không được để trống.")

    if len(value) < 3:
        raise serializers.ValidationError(
            "Tên trang phục quá ngắn. Hãy nhập tên mô tả món đồ cụ thể."
        )

    meaningless_values = {
        "hehe", "haha", "hihi",
        "test", "testing",
        "abc", "abcd",
        "asdf", "qwerty", "xxx",
    }

    if value.lower() in meaningless_values:
        raise serializers.ValidationError(
            'Tên trang phục chưa rõ ràng. Ví dụ: "Áo thun trắng", "Quần jean xanh".'
        )

    return value


# =========================================================
# CLOTHING BASE
# =========================================================

class ClothingItemBaseSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        return validate_clothing_name(value)

    def validate_color(self, value):
        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError("Vui lòng chọn màu sắc.")

        return value


# =========================================================
# CLOTHING CREATE
# =========================================================

class ClothingItemCreateSerializer(ClothingItemBaseSerializer):

    class Meta:
        model = ClothingItem
        fields = (
            "id", "name", "category", "color", "season",
            "occasion", "image", "is_favorite",
        )
        read_only_fields = ("id",)

        extra_kwargs = {
            "name": {
                "error_messages": {
                    "required": "Vui lòng nhập tên trang phục.",
                    "blank": "Tên trang phục không được để trống.",
                    "max_length": "Tên trang phục quá dài.",
                }
            },
            "category": {
                "error_messages": {
                    "required": "Vui lòng chọn loại trang phục.",
                    "blank": "Vui lòng chọn loại trang phục.",
                    "invalid_choice": "Loại trang phục không hợp lệ.",
                }
            },
            "color": {
                "error_messages": {
                    "required": "Vui lòng chọn màu sắc.",
                    "blank": "Vui lòng chọn màu sắc.",
                    "max_length": "Tên màu sắc quá dài.",
                }
            },
            "season": {
                "error_messages": {
                    "required": "Vui lòng chọn mùa phù hợp.",
                    "blank": "Vui lòng chọn mùa phù hợp.",
                    "invalid_choice": "Mùa được chọn không hợp lệ.",
                }
            },
            "occasion": {
                "error_messages": {
                    "required": "Vui lòng chọn hoàn cảnh sử dụng.",
                    "blank": "Vui lòng chọn hoàn cảnh sử dụng.",
                    "invalid_choice": "Hoàn cảnh sử dụng không hợp lệ.",
                }
            },
            "image": {
                "error_messages": {
                    "invalid": "Hình ảnh không hợp lệ.",
                }
            },
        }

    def create(self, validated_data):
        request = self.context["request"]
        return ClothingItem.objects.create(user=request.user, **validated_data)


# =========================================================
# CLOTHING UPDATE
# =========================================================

class ClothingItemUpdateSerializer(ClothingItemBaseSerializer):

    class Meta:
        model = ClothingItem
        fields = (
            "name", "category", "color", "season",
            "occasion", "image", "is_favorite",
        )

        extra_kwargs = {
            "name": {
                "error_messages": {
                    "blank": "Tên trang phục không được để trống.",
                    "max_length": "Tên trang phục quá dài.",
                }
            },
            "category": {
                "error_messages": {
                    "blank": "Vui lòng chọn loại trang phục.",
                    "invalid_choice": "Loại trang phục không hợp lệ.",
                }
            },
            "color": {
                "error_messages": {
                    "blank": "Vui lòng chọn màu sắc.",
                    "max_length": "Tên màu sắc quá dài.",
                }
            },
            "season": {
                "error_messages": {
                    "blank": "Vui lòng chọn mùa phù hợp.",
                    "invalid_choice": "Mùa được chọn không hợp lệ.",
                }
            },
            "occasion": {
                "error_messages": {
                    "blank": "Vui lòng chọn hoàn cảnh sử dụng.",
                    "invalid_choice": "Hoàn cảnh sử dụng không hợp lệ.",
                }
            },
            "image": {
                "error_messages": {
                    "invalid": "Hình ảnh không hợp lệ.",
                }
            },
        }


# =========================================================
# CLOTHING LIST
# =========================================================

class ClothingItemListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClothingItem
        fields = ("id", "name", "category", "color", "image", "is_favorite")


# =========================================================
# CLOTHING DETAIL
# =========================================================

class ClothingItemDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClothingItem
        fields = (
            "id", "name", "category", "color", "season",
            "occasion", "image", "is_favorite",
            "created_at", "updated_at",
        )


# =========================================================
# AI VISION - IMAGE INPUT
# =========================================================

class ClothingImageAnalyzeSerializer(serializers.Serializer):
    image = serializers.ImageField()


# =========================================================
# AI VISION - ANALYSIS RESULT
# =========================================================

class ClothingAnalysisResultSerializer(serializers.Serializer):

    STATUS_SUCCESS = "success"
    STATUS_CANNOT_ANALYZE = "cannot_analyze"

    REASON_IMAGE_TOO_BLURRY = "image_too_blurry"
    REASON_IMAGE_TOO_DARK = "image_too_dark"
    REASON_MULTIPLE_ITEMS = "multiple_items"
    REASON_NOT_CLOTHING = "not_clothing"
    REASON_OBJECT_OCCLUDED = "object_occluded"

    status = serializers.ChoiceField(
        choices=(STATUS_SUCCESS, STATUS_CANNOT_ANALYZE)
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

    suggested_name = serializers.CharField(max_length=255, allow_null=True)

    category = serializers.ChoiceField(
        choices=ClothingItem.Category.choices,
        allow_null=True,
    )

    color = serializers.CharField(max_length=100, allow_null=True)

    season = serializers.ChoiceField(
        choices=ClothingItem.Season.choices,
        allow_null=True,
    )

    occasion = serializers.ChoiceField(
        choices=ClothingItem.Occasion.choices,
        allow_null=True,
    )

    def validate_suggested_name(self, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise serializers.ValidationError("Tên gợi ý không được để trống.")

        return value

    def validate_color(self, value):
        if value is None:
            return value

        value = value.strip().lower()

        if not value:
            raise serializers.ValidationError("Màu sắc không được để trống.")

        return value

    def validate(self, attrs):
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

    def _validate_success_result(self, *, attrs, reason, result_fields):
        errors = {}

        if reason is not None:
            errors["reason"] = "Reason phải là null khi phân tích thành công."

        for field in result_fields:
            if attrs.get(field) is None:
                errors[field] = "Trường này không được null khi phân tích thành công."

        if errors:
            raise serializers.ValidationError(errors)

    def _validate_failed_result(self, *, attrs, reason, result_fields):
        errors = {}

        if reason is None:
            errors["reason"] = "Phải có lý do khi không thể phân tích ảnh."

        for field in result_fields:
            if attrs.get(field) is not None:
                errors[field] = "Trường này phải là null khi không thể phân tích ảnh."

        if errors:
            raise serializers.ValidationError(errors)


# =========================================================
# AI OUTFIT - REQUEST
# =========================================================

class OutfitRecommendationRequestSerializer(serializers.Serializer):

    occasion = serializers.ChoiceField(
        choices=ClothingItem.Occasion.choices
    )

    season = serializers.ChoiceField(
        choices=ClothingItem.Season.choices
    )


# =========================================================
# AI OUTFIT - RESULT
# =========================================================

class OutfitRecommendationResultSerializer(serializers.Serializer):

    status = serializers.ChoiceField(
        choices=("success", "cannot_recommend")
    )

    reason = serializers.CharField(
        allow_null=True,
        required=False,
    )

    item_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True,
    )

    explanation = serializers.CharField(
        allow_null=True,
    )

    def validate(self, attrs):
        status = attrs["status"]
        reason = attrs.get("reason")
        item_ids = attrs["item_ids"]
        explanation = attrs.get("explanation")

        if status == "success":
            if reason is not None:
                raise serializers.ValidationError(
                    "reason phải là null khi gợi ý outfit thành công."
                )

            if not item_ids:
                raise serializers.ValidationError(
                    "item_ids không được rỗng khi gợi ý outfit thành công."
                )

            if not explanation:
                raise serializers.ValidationError(
                    "explanation là bắt buộc khi gợi ý outfit thành công."
                )

        if status == "cannot_recommend":
            if not reason:
                raise serializers.ValidationError(
                    "reason là bắt buộc khi không thể gợi ý outfit."
                )

            if item_ids:
                raise serializers.ValidationError(
                    "item_ids phải rỗng khi không thể gợi ý outfit."
                )

        return attrs