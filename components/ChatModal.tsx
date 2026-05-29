import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot, User } from 'lucide-react';
import { Conversation, ChatMessage } from '../types';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: Conversation;
    onSendMessage: (conversationId: string, text: string) => void;
}

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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-bg-darker/90 backdrop-blur-sm" 
                        onClick={onClose} 
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl h-[80vh] bg-bg-dark rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden glass-panel z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 flex items-center space-x-4 border-b border-white/10 bg-bg-darker/50 backdrop-blur-md z-10 shrink-0">
                            <div className="relative">
                                <img 
                                    src={conversation.productImageUrl} 
                                    alt={conversation.productName} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/seed/${conversation.productId}/200/200`;
                                    }}
                                    className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-white/5" 
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-bg-darker shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-white text-lg truncate mb-1">{conversation.productName}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-brand-primary flex items-center gap-1" style={{ color: 'var(--color-brand-primary)' }}>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75" style={{ backgroundColor: 'var(--color-brand-primary)' }}></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary" style={{ backgroundColor: 'var(--color-brand-primary)' }}></span>
                                    </span>
                                    AI Agent Online
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar relative">
                            {/* Ambient background glow inside chat area */}
                            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary rounded-full blur-[120px] mix-blend-screen" style={{ backgroundColor: 'var(--color-brand-primary)' }}></div>
                            </div>

                            {conversation.messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4 relative z-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                                        <Bot size={32} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                                    </div>
                                    <p className="font-bold text-white mb-2">Secure Channel Established</p>
                                    <p className="text-sm text-text-secondary max-w-xs">You are now connected to the asset's verified representative agent.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 relative z-10">
                                    {conversation.messages.map((msg, index) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.05 }}
                                            key={msg.id} 
                                            className={`flex ${msg.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'currentUser' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className="shrink-0 mt-auto mb-1">
                                                    {msg.sender === 'currentUser' ? (
                                                        <div className="w-8 h-8 rounded-full bg-brand-primary border border-brand-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.3)]" style={{ backgroundColor: 'var(--color-brand-primary)' }}>
                                                            <User size={14} className="text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                            <Bot size={14} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div 
                                                    className={`px-5 py-3 rounded-2xl md:text-[15px] leading-relaxed shadow-sm ${
                                                        msg.sender === 'currentUser' 
                                                            ? 'bg-brand-primary text-white rounded-br-sm border border-brand-primary/50' 
                                                            : 'bg-white/5 text-white/90 rounded-bl-sm border border-white/10'
                                                    }`}
                                                    style={msg.sender === 'currentUser' ? { backgroundColor: 'var(--color-brand-primary)' } : {}}
                                                >
                                                    <p>{msg.text}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 bg-bg-darker/80 border-t border-white/10 backdrop-blur-md shrink-0">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Transmit secure protocol..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-16 text-white placeholder-text-muted focus:outline-none focus:border-brand-primary focus:bg-white/10 transition-all font-mono text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="absolute right-2 p-2.5 bg-brand-primary text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)] glow-orange flex items-center justify-center"
                                    aria-label="Send message"
                                    style={{ backgroundColor: 'var(--color-brand-primary)' }}
                                >
                                    <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
                                </button>
                            </form>
                            <p className="text-center mt-3 text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                End-to-End Encrypted Transmission
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};