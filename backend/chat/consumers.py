import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Get token from query string
        query_string = self.scope.get('query_string', b'').decode()
        token_key = None
        if 'token=' in query_string:
            token_key = query_string.split('token=')[1].split('&')[0]

        # Authenticate user
        self.user = await self.get_user_from_token(token_key)

        if self.user == AnonymousUser() or not await self.is_participant(self.user, self.conversation_id):
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('message')

        if not message_text:
            return

        # Save message to database and get receiver info
        message_obj, receiver_id = await self.save_message(self.user, self.conversation_id, message_text)

        # Send message to room group
        msg_payload = {
            'type': 'chat_message',
            'message': message_text,
            'sender_id': self.user.id,
            'sender_username': self.user.username,
            'created_at': message_obj.created_at.isoformat(),
            'conversation_id': self.conversation_id
        }
        await self.channel_layer.group_send(self.room_group_name, msg_payload)

        # Send notification to the receiver's global group
        if receiver_id:
            await self.channel_layer.group_send(
                f'user_{receiver_id}',
                {
                    'type': 'chat_notification',
                    'message': message_text,
                    'conversation_id': self.conversation_id,
                    'sender_id': self.user.id,
                    'sender_username': self.user.username,
                    'created_at': message_obj.created_at.isoformat()
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'created_at': event['created_at'],
            'conversation_id': event.get('conversation_id')
        }))

    @database_sync_to_async
    def get_user_from_token(self, token_key):
        if not token_key:
            return AnonymousUser()
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return AnonymousUser()

    @database_sync_to_async
    def is_participant(self, user, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            return user == conversation.customer or user == conversation.vendor
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, user, conversation_id, text):
        conversation = Conversation.objects.get(id=conversation_id)
        msg = Message.objects.create(
            conversation=conversation,
            sender=user,
            text=text
        )
        receiver = conversation.vendor if user == conversation.customer else conversation.customer
        return msg, receiver.id

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope.get('query_string', b'').decode()
        token_key = None
        if 'token=' in query_string:
            token_key = query_string.split('token=')[1].split('&')[0]

        self.user = await self.get_user_from_token(token_key)

        if self.user == AnonymousUser():
            await self.close()
            return

        self.user_group_name = f'user_{self.user.id}'

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def chat_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': event['message'],
            'conversation_id': event['conversation_id'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'created_at': event['created_at']
        }))

    @database_sync_to_async
    def get_user_from_token(self, token_key):
        if not token_key:
            return AnonymousUser()
        try:
            token = Token.objects.get(key=token_key)
            return token.user
        except Token.DoesNotExist:
            return AnonymousUser()
