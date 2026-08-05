from rest_framework import status
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return None

    message = "Có lỗi xảy ra."

    if response.status_code == status.HTTP_400_BAD_REQUEST:
        message = "Dữ liệu không hợp lệ."

    elif response.status_code == status.HTTP_401_UNAUTHORIZED:
        message = "Bạn chưa đăng nhập."

    elif response.status_code == status.HTTP_403_FORBIDDEN:
        message = "Bạn không có quyền thực hiện thao tác này."

    elif response.status_code == status.HTTP_404_NOT_FOUND:
        message = "Không tìm thấy dữ liệu."

    response.data = {
        "success": False,
        "message": message,
        "errors": response.data,
    }

    return response