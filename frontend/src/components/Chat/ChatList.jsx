import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { MessageSquare, Loader2, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    const { role } = useAuth();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('chat/conversations/');
                setConversations(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const filteredConversations = conversations.filter(conv => {
        const partner = userId === conv.customer ? conv.vendor_info : conv.customer_info;
        return partner?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10 h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm border overflow-hidden max-w-4xl mx-auto w-full ${role === 'vendor' ? '' : 'my-8'}`}>
            {/* Header */}
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
                    Messages
                </h2>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                    />
                </div>
            </div>

            {/* List */}
            <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredConversations.length > 0 ? (filteredConversations.map(conv => {
                    const partner = userId === conv.customer ? conv.vendor_info : conv.customer_info;
                    const lastMsg = conv.last_message;
                    
                    return (
                        <div 
                            key={conv.id}
                            onClick={() => navigate(`/chat/${conv.id}`)}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden flex-shrink-0">
                                {partner?.profile_picture ? (
                                    <img src={`http://localhost:8000${partner.profile_picture}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold truncate group-hover:text-blue-600 transition-colors ${conv.unread_count > 0 ? 'text-black' : 'text-gray-900'}`}>
                                        {partner?.username}
                                    </h3>
                                    {lastMsg && (
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(lastMsg.created_at).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-sm truncate italic ${conv.unread_count > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                        {lastMsg ? lastMsg.text || lastMsg.message : 'No messages yet'}
                                    </p>
                                    {conv.unread_count > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })) : (
                    <div className="p-10 text-center text-gray-500 italic">
                        No conversations found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
