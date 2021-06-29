from django.urls import path, include

from . import views

app_name = "authviews"

urlpatterns = [

    path('register/', views.RegisterView.as_view(), name="register"),
  
    path('login/', views.LoginView.as_view(), name="login"),

    path('logout/', views.LogoutView.as_view(), name="logout"),

    path('new_password/', views.CreateNewPassword.as_view(), name="new_password"),

]
