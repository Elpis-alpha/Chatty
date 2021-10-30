from django.urls import path

from . import views

app_name = "chat"

urlpatterns = [
  
    path('', views.HomeView.as_view(), name="home"),

    path('settings', views.ChattySettingsView.as_view(), name="chatty-settings"),

    path('dialogue/<recipient>', views.DialogueView.as_view(), name="dialogue"),

    path('group/<name>', views.GroupView.as_view(), name="group"),

    path('user-detail/<recipient>', views.UserDetailView.as_view(), name="user-detail"),

    path('group-detail/<name>', views.GroupDetailView.as_view(), name="group-detail"),

    path('group/settings/<name>', views.GroupSettingsView.as_view(), name="group-settings"),

    path('group/join-group/<group>/<join_key>', views.JoinGroupView.as_view(), name="group-join"),

    path('group/admin-group/<group>/<join_key>', views.AdminGroupView.as_view(), name="group-admin"),

    path('new-group', views.NewGroupView.as_view(), name="new-group"),

]
