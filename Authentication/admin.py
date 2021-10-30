from django.contrib import admin

from .models import ChattyUser

# Register your models here.

class ChattyUserAdmin(admin.ModelAdmin):

  list_display = ['display_name', 'user', 'id']

  search_fields = ['display_name']


admin.site.register(ChattyUser, ChattyUserAdmin)