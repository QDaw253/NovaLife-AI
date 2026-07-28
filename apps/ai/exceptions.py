class AIServiceError(Exception):
    """Lỗi chung khi gọi dịch vụ AI."""


class AIResponseError(AIServiceError):
    """AI trả về dữ liệu không hợp lệ."""