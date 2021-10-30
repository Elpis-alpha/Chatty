from django.contrib import admin

from .models import Acquaintance

from .models import ChattyUserSetting

from .models import ChattyGroup

from .models import ChattyGroupSetting

from .models import Message

from .models import ChattyUserNotification

# Register your models here.

class AcquaintanceAdmin(admin.ModelAdmin):

  list_display = ['name', 'chatty_user', 'user_acquaintance', 'group']


class ChattyUserSettingAdmin(admin.ModelAdmin):

  list_display = ['chatty_user', 'counter']


class ChattyUserNotificationAdmin(admin.ModelAdmin):

  list_display = ['chatty_user', 'name', 'header']


class ChattyGroupAdmin(admin.ModelAdmin):

  list_filter = ['is_dialogue']

  list_display = ['name', 'group_name', 'id']


class ChattyGroupSettingAdmin(admin.ModelAdmin):

  list_display = ['group', 'id']


class MessageAdmin(admin.ModelAdmin):

  list_filter = ['group']

  list_display = ['group', 'id']


admin.site.register(Acquaintance, AcquaintanceAdmin)

admin.site.register(ChattyUserSetting, ChattyUserSettingAdmin)

admin.site.register(ChattyUserNotification, ChattyUserNotificationAdmin)

admin.site.register(ChattyGroup, ChattyGroupAdmin)

admin.site.register(ChattyGroupSetting, ChattyGroupSettingAdmin)

admin.site.register(Message, MessageAdmin)
