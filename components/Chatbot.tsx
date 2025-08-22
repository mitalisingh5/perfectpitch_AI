import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

interface ChatbotProps {
  messages: Message[];
  onSendMessage: (message: Message) => Promise<void>;
  onToggleHistory: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, onToggleHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const doSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { text: trimmedInput, sender: 'user' };
    setInputValue('');
    setIsLoading(true);
    await onSendMessage(userMessage);
    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        doSendMessage();
    }
  };


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-accent rounded-full text-dark-text flex items-center justify-center shadow-lg hover:bg-highlight transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-highlight"
          aria-label="Toggle chatbot"
        >
            {isOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 24 24" fill="currentColor">
                    {/* Robot Head */}
                    <path d="M15 4H9a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2zM9.5 7.5a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    {/* Robot Body as a Card */}
                    <path d="M7 11h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2zm2 2h6v1H9v-1zm0 3h4v1H9v-1z" />
                </svg>
            )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[60vh] max-h-[700px] bg-primary/80 backdrop-blur-md border border-secondary rounded-lg shadow-2xl z-50 flex flex-col animate-fade-in-up">
            <header className="p-4 border-b border-secondary flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-dark-text">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-light-text">PitchBot Helper</h4>
                        <p className="text-xs text-highlight">Online</p>
                    </div>
                </div>
                <button onClick={onToggleHistory} title="View chat history" className="p-2 text-accent/80 hover:text-highlight transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-dark-text text-xs font-bold">AI</div>}
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-secondary text-light-text rounded-br-none' : 'bg-primary border border-secondary text-light-text/90 rounded-bl-none'}`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-dark-text text-xs font-bold">AI</div>
                        <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-primary border border-secondary text-light-text/90 rounded-bl-none">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="w-2 h-2 bg-highlight rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-highlight rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-highlight rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-secondary">
                <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask PitchBot anything..."
                        className="flex-1 w-full p-2 bg-primary border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 text-light-text placeholder:text-accent/70"
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="px-4 py-2 bg-accent text-dark-text font-semibold rounded-lg shadow-md hover:bg-highlight disabled:bg-secondary disabled:cursor-not-allowed transition-colors duration-300">
                       Send
                    </button>
                </form>
                <p className="text-xs text-accent/70 mt-2 text-center">
                    Press <kbd className="font-sans border border-secondary rounded px-1.5 py-0.5">Ctrl</kbd> + <kbd className="font-sans border border-secondary rounded px-1.5 py-0.5">Enter</kbd> to send
                </p>
            </footer>
        </div>
      )}
    </>
  );
};

export default Chatbot;