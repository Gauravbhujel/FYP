from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(customer=user) | Q(vendor=user)).order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_or_create_conversation(request):
    vendor_id = request.data.get('vendor_id')
    vendor_profile_id = request.data.get('vendor_profile_id')
    
    vendor_user = None
    
    if vendor_id:
        try:
            vendor_user = User.objects.get(id=vendor_id)
        except User.DoesNotExist:
            return Response({"error": "Vendor user not found"}, status=status.HTTP_404_NOT_FOUND)
    elif vendor_profile_id:
        try:
            from vendors.models import Vendor
            vendor_profile = Vendor.objects.get(id=vendor_profile_id)
            vendor_user = vendor_profile.user
        except ImportError:
            return Response({"error": "Vendor model not available"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Vendor.DoesNotExist:
            return Response({"error": "Vendor profile not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "vendor_id or vendor_profile_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    if vendor_user.role != 'vendor':
        return Response({"error": "User is not a vendor"}, status=status.HTTP_400_BAD_REQUEST)

    conversation, created = Conversation.objects.get_or_create(
        customer=request.user,
        vendor=vendor_user
    )
    
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

class MessageListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def list(self, request, *args, **kwargs):
        conversation_id = self.kwargs['conversation_id']
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            from rest_framework.response import Response
            from rest_framework import status
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Security: only participants can view messages
        if self.request.user != conversation.customer and self.request.user != conversation.vendor:
            from rest_framework.response import Response
            from rest_framework import status
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
            
        # Mark messages as read where sender is NOT the current user
        Message.objects.filter(
            conversation_id=conversation_id, 
            is_read=False
        ).exclude(sender=request.user).update(is_read=True)
        
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(conversation_id=conversation_id).order_by('created_at')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    user = request.user
    count = Message.objects.filter(
        conversation__customer=user
    ).exclude(sender=user).filter(is_read=False).count() + Message.objects.filter(
        conversation__vendor=user
    ).exclude(sender=user).filter(is_read=False).count()
    return Response({'unread_count': count}, status=status.HTTP_200_OK)
