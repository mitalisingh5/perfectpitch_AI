import React from 'react';
import type { Message } from '../types';

interface ChatHistoryProps {
  history: Message[][];
  onSelectConversation: (conversation: Message[]) => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history, onSelectConversation, onClose }) => {
  // Find the first user message in a conversation to use as a title
  const getConversationTitle = (conversation: Message[]): string => {
    const userMessage = conversation.find(msg => msg.sender === 'user');
    return userMessage ? userMessage.text : 'Conversation';
  };

  return (
    <div 
        className="fixed inset-0 bg-primary/70 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in-up" 
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg h-[80vh] max-h-[800px] p-6 bg-primary border border-secondary rounded-xl shadow-2xl m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-secondary">
          <h2 className="text-2xl font-bold text-light-text">
            Chat History
          </h2>
          <button onClick={onClose} className="text-accent/80 hover:text-highlight transition-colors" aria-label="Close history modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-accent/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-semibold">No history yet.</p>
                <p className="text-sm">Your past conversations will appear here after you start a new pitch.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((convo, index) => (
                <li key={index}>
                  <button 
                    onClick={() => onSelectConversation(convo)}
                    className="w-full text-left p-4 bg-secondary/30 border border-secondary rounded-lg hover:bg-secondary/60 hover:border-highlight/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-highlight"
                  >
                    <p className="text-sm text-highlight font-semibold truncate">
                        {getConversationTitle(convo)}
                    </p>
                    <p className="text-xs text-accent/70 mt-1">
                      {convo.length} messages
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
