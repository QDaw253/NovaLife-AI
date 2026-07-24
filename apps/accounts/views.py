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
class LoginView(APIView):
    def post(self, request):
        result = AuthService.login(request.data)

        return Response(
            {
                "message":"Đăng nhập thành công",
                "user": UserSerializer(result["user"]).data,
                "access":result["access"],
                "refresh": result["refresh"],
            },
            status = status.HTTP_200_OK,
        )        