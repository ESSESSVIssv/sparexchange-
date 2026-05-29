import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X } from 'lucide-react';
import { Conversation } from '../types';

interface ChatListModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    onSelectConversation: (conversationId: string) => void;
}

export const ChatListModal: React.FC<ChatListModalProps> = ({ isOpen, onClose, conversations, onSelectConversation }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-end sm:p-4 pointer-events-auto">
                    {/* Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-bg-darker/80 backdrop-blur-sm" 
                        onClick={onClose} 
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.5 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-bg-dark/95 backdrop-blur-xl sm:rounded-l-3xl border-l border-white/10 shadow-2xl flex flex-col flex-shrink-0 z-10 glass-panel"
                    >
                        <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                                    <MessageSquare size={20} className="text-brand-primary" style={{ color: 'var(--color-brand-primary)' }} />
                                </div>
                                <h2 className="text-2xl font-bold text-white font-display">Secure Comms</h2>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            {conversations.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                        <MessageSquare size={32} className="text-text-muted" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-display">No comms established</h3>
                                    <p className="text-text-secondary text-sm">Initiate secure communications from an asset's profile page.</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {conversations.map(convo => (
                                        <motion.li 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={convo.id} 
                                            onClick={() => onSelectConversation(convo.id)} 
                                            className="group flex flex-col space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                                    <img 
                                                        src={convo.productImageUrl} 
                                                        alt={convo.productName} 
                                                        referrerPolicy="no-referrer"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = `https://picsum.photos/seed/${convo.productId}/200/200`;
                                                        }}
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <div className="flex-grow overflow-hidden">
                                                    <p className="font-bold text-white truncate text-lg group-hover:text-brand-primary transition-colors">{convo.productName}</p>
                                                    <p className="text-sm text-text-secondary truncate pr-2 mt-1">
                                                        {convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : 'Awaiting transmission...'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};