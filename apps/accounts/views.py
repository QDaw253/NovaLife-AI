from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .services import AuthService
from .serializers import UserSerializer
class RegisterView(APIView):

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

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = AuthService.me(request.user)
        serializer = UserSerializer(user)

        return Response(
            { "user": serializer.data, },
            status=status.HTTP_200_OK,
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        AuthService.logout(request.data)

        return Response(
            { "message":"Đăng xuất thành công", },
            status=status.HTTP_200_OK,
        )
