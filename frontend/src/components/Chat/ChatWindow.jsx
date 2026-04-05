import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    const token = localStorage.getItem('token');
    const { role } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                // Fetch previous messages
                const msgRes = await api.get(`chat/messages/${conversationId}/`);
                setMessages(msgRes.data);
                
                // Fetch conversation details (to get vendor/customer info)
                const convRes = await api.get(`chat/conversations/${conversationId}/`);
                setConversation(convRes.data);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching chat data:', err);
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchConversation();
        }
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId || !token) return;

        // Construct WebSocket URL with token
        const wsUrl = `ws://localhost:8000/ws/chat/${conversationId}/?token=${token}`;
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
            console.log('Chat WebSocket connected');
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        newSocket.onclose = () => {
            console.log('Chat WebSocket disconnected');
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [conversationId, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.send(JSON.stringify({
            message: newMessage
        }));

        setNewMessage('');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!conversation) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <p className="text-gray-500 mb-4">Conversation not found</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
            </div>
        );
    }

    const partner = role === 'vendor' ? conversation?.customer_info : conversation?.vendor_info;
    const currentUserId = role === 'vendor' ? conversation?.vendor : conversation?.customer;

    return (
        <div className={`flex flex-col bg-white w-full max-w-4xl mx-auto shadow-lg border-x ${role === 'vendor' ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-80px)] rounded-xl my-4'}`}>
            {/* Header */}
            <div className={`flex items-center p-4 border-b bg-white sticky top-0 z-10 ${role !== 'vendor' ? 'rounded-t-xl' : ''}`}>
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-800">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 border overflow-hidden">
                        {partner?.profile_picture ? (
                            <img src={`http://localhost:8000${partner.profile_picture}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            partner?.username?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{partner?.username}</h3>
                        <p className="text-xs text-green-500 font-medium">{partner?.role}</p>
                    </div>
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender === currentUserId || msg.sender_id === currentUserId;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                                    isMe 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text || msg.message}</p>
                                    <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t bg-white ${role !== 'vendor' ? 'rounded-b-xl' : ''}`}>
                <div className="flex items-center gap-2">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
