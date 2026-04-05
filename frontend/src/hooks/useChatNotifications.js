import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export const useChatNotifications = () => {
    const { token, isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        // Fetch initial count
        api.get('chat/unread-count/').then(res => {
            setUnreadCount(res.data.unread_count);
        }).catch(err => console.error('Error fetching unread count:', err));

        const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
                api.get('chat/unread-count/').then(res => {
                    setUnreadCount(res.data.unread_count);
                }).catch(err => console.error('Error fetching unread count:', err));
            }
        };

        ws.onclose = () => {
            console.log('Notification WebSocket disconnected');
        };

        return () => ws.close();
    }, [token, isAuthenticated]);

    // Expose a method to manually decrement/reset count if needed
    const decrementCount = (amount = 1) => {
        setUnreadCount(prev => Math.max(0, prev - amount));
    };

    const resetCount = () => {
        setUnreadCount(0);
    };

    return { unreadCount, decrementCount, resetCount, setUnreadCount };
};
