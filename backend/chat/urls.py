from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, get_or_create_conversation, MessageListView, get_unread_count

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversations')

urlpatterns = [
    path('', include(router.urls)),
    path('get_or_create/', get_or_create_conversation, name='get_or_create_conversation'),
    path('messages/<int:conversation_id>/', MessageListView.as_view(), name='message_list'),
    path('unread-count/', get_unread_count, name='unread_count'),
]
