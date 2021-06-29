import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChattyConsumer(AsyncWebsocketConsumer):

  async def connect(self):

    self.chatty_user = self.scope['url_route']['kwargs']['username']

    self.chatty_user_room = 'message_to_%s' % self.chatty_user

    # Join room group

    await self.channel_layer.group_add(

        self.chatty_user_room,

        self.channel_name

    )

    await self.accept()

  async def disconnect(self, close_code):

    # Leave room group

    await self.channel_layer.group_discard(

        self.chatty_user_room,

        self.channel_name

    )

  async def receive(self, text_data):

    text_data_json = json.loads(text_data)

    message = text_data_json['text']

    # Send message to room group

    await self.channel_layer.group_send(

        self.chatty_user_room,

        {

            'type': 'chatty_user_message',

            'message': message

        }

    )

  async def chatty_user_message(self, event):

    message = event['message']

    # Send message to WebSocket

    await self.send(text_data=json.dumps({

        'message': message

    }))
