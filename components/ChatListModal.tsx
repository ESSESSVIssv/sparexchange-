import React from 'react';
import { Conversation } from '../types';

interface ChatListModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    onSelectConversation: (conversationId: string) => void;
}

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const ChatListModal: React.FC<ChatListModalProps> = ({ isOpen, onClose, conversations, onSelectConversation }) => {
    return (
        <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
             {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal Panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Your Chats</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center">
                            <ChatBubbleIcon />
                            <h3 className="text-xl font-semibold text-slate-600 mt-4">No conversations yet</h3>
                            <p className="text-slate-500 mt-2">Start a chat from a product page.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {conversations.map(convo => (
                                <li key={convo.id} onClick={() => onSelectConversation(convo.id)} className="p-4 flex items-center space-x-4 hover:bg-slate-50 cursor-pointer transition-colors">
                                    <img src={convo.productImageUrl} alt={convo.productName} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-bold text-slate-800 truncate">{convo.productName}</p>
                                        <p className="text-sm text-slate-500 truncate">
                                            {convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : 'No messages yet'}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};