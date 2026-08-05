from rest_framework import status
from rest_framework.response import Response


def success_response(
    *,
    data=None,
    message="Thành công.",
    status_code=status.HTTP_200_OK,
):
    return Response(
        {
            "success": True,
            "message": message,
            "data": data,
        },
        status=status_code,
    )


def error_response(
    *,
    errors=None,
    message="Có lỗi xảy ra.",
    status_code=status.HTTP_400_BAD_REQUEST,
):
    return Response(
        {
            "success": False,
            "message": message,
            "errors": errors,
        },
        status=status_code,
    )