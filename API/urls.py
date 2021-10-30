from django.urls import path, include

from . import views

app_name = "api"

urlpatterns = [

  path('chatty-users/', views.ChattyUserList.as_view(), name='chatty-users'),

  path('chatty-users/id/<id>/', views.ChattyUserByID.as_view(), name='chatty-user-id'),

  path('chatty-users/username/<username>/', views.ChattyUserByUsername.as_view(), name='chatty-user-username'),

  path('chatty-users/email/<email>/', views.ChattyUserByEmail.as_view(), name='chatty-user-email'),
  
  path('chatty-user-settings/get-or-post/', views.ChattyUserSettings.as_view(), name='user-setting'),

  path('chatty-groups/', views.ChattyGroupList.as_view(), name='chatty-groups'),

  path('chatty-groups/name/<name>/', views.ChattyGroupByName.as_view(), name='chatty-group-name'),
  
  path('chatty-groups/get-group-link/', views.GroupLinkActivities.as_view(), name='get-group-link'),
  
  path('chatty-groups/get-all-groups-by/', views.AllGroupsByUser.as_view(), name='get-all-groups-by'),

  path('chatty-groups/get-random-dialogues/', views.GetRandomDialogues.as_view(), name='get-random-dialogues'),
  
  path('chatty-group-settings/get-or-post/', views.GroupSettings.as_view(), name='group-setting'),

  path('messages/list-through/<group>/<start>/<end>/', views.MessageByGroup.as_view(), name='message'),

  path('messages/by-id/<id>/', views.MessageByID.as_view(), name='message-id'),

  path('messages/by-group-last/', views.MessageByGroupLast.as_view(), name='message-group-last'),

  path('is-dialogue/<user>/<other>/', views.IsDialogue.as_view(), name='is_dialogue'),

  path('is-acquaintance/<user>/<other>/', views.IsAcquaintance.as_view(), name='is_acq'),

  path('messages/create/', views.AllMessagePost.as_view(), name='message-post'),

  path('notifications/by-start-and-stop/', views.Notification.as_view(), name='notification'),

  path('chatty-groups/delete-dialogue/', views.deleteDialogue.as_view(), name='delete-dialogue'),

  path('chatty-groups/leave-group/', views.LeaveGroup.as_view(), name='leave-group'),

  path('chatty-all/search/all/', views.SearchAll.as_view(), name='search-all'),
]
