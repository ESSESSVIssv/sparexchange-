import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage } from '../types';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: Conversation;
    onSendMessage: (conversationId: string, text: string) => void;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, conversation, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(conversation.id, message);
            setMessage('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg h-[70vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex items-center space-x-4 border-b">
                    <img src={conversation.productImageUrl} alt={conversation.productName} className="w-12 h-12 object-cover rounded-md" />
                    <div className="flex-grow">
                        <p className="font-bold text-slate-800 truncate">{conversation.productName}</p>
                        <p className="text-sm text-slate-500">Online</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {conversation.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'currentUser' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-white">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-grow border border-slate-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};