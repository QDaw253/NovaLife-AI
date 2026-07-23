from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import AuthService
from .serializers import UserSerializer
class RegisterView(APIView):
    """
    API đăng ký tài khoản
    """
    def post(self,request):
        user = AuthService.register(request.data)
        serializer = UserSerializer(user)
        return Response(
            {
                "message": "Đăng ký thành công",
                "user": serializer.data,
            },
        status=status.HTTP_201_CREATED,
        )
        