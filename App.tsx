import React, { useState, useCallback } from 'react';
import type { PitchData, RatingData, Message } from './types';
import { generatePitch, rateIdea, sendMessage, resetChat, recreateChatFromHistory } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import InputForm from './components/InputForm';
import PitchResult from './components/PitchResult';
import RatingResult from './components/RatingResult';
import Loader from './components/Loader';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import ChatHistory from './components/ChatHistory';

const initialMessage: Message = { 
  text: "Hi! I'm PitchBot. How can I help you refine your startup idea today?", 
  sender: 'bot' 
};

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [chatHistory, setChatHistory] = useState<Message[][]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setIdea('');
    setLocation('');
    setPitchData(null);
    setRatingData(null);
    setError(null);
    setRatingError(null);
    setMessages([initialMessage]);
    setChatHistory([]);
    setShowHistoryPanel(false);
    resetChat();
    setShowLoginModal(true); // Show login when logging out
  };


  const handleGeneratePitch = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter your startup idea.');
      return;
    }

    // Archive the current conversation before starting a new one
    if (messages.length > 1) { // more than just the initial message
      setChatHistory(prev => [...prev, messages]);
    }
    // Reset chat for the new context
    resetChat();
    setMessages([initialMessage]);

    setIsLoading(true);
    setError(null);
    setPitchData(null);
    setRatingData(null);
    setRatingError(null);

    try {
      const data = await generatePitch(idea, location);
      setPitchData(data);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [idea, location, messages]);

  const handleRateIdea = useCallback(async () => {
    if (!pitchData) return;

    setIsRatingLoading(true);
    setRatingError(null);
    try {
        const data = await rateIdea(idea, pitchData);
        setRatingData(data);
    } catch (err) {
        if (err instanceof Error) {
            setRatingError(err.message);
        } else {
            setRatingError('An unexpected error occurred while rating the idea.');
        }
    } finally {
        setIsRatingLoading(false);
    }
  }, [idea, pitchData]);

  const handleSendMessage = async (userMessage: Message) => {
    setMessages(prev => [...prev, userMessage]);
    try {
      const botResponseText = await sendMessage(userMessage.text);
      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSelectConversation = (conversation: Message[]) => {
    recreateChatFromHistory(conversation);
    setMessages(conversation);
    setShowHistoryPanel(false);
  };


  return (
    <div className="min-h-screen bg-primary text-light-text font-sans flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-secondary/50 -z-10"></div>
      
      <Header 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />
      
      {showLoginModal && <Login onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
      
      {isLoggedIn && showHistoryPanel && (
        <ChatHistory 
          history={chatHistory}
          onSelectConversation={handleSelectConversation}
          onClose={() => setShowHistoryPanel(false)}
        />
      )}


      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {!isLoggedIn ? (
            <div className="text-center animate-fade-in-up p-8 bg-secondary/30 border border-secondary rounded-xl">
              <h2 className="text-3xl font-bold text-light-text">Welcome to PitchPerfect AI</h2>
              <p className="mt-4 text-lg text-accent">Your personal AI-powered assistant to craft the perfect business pitch.</p>
              <p className="mt-2 text-accent/80">Please log in to begin turning your ideas into reality.</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-8 px-8 py-3 bg-accent text-dark-text font-bold rounded-lg shadow-lg hover:bg-highlight transition-all duration-300 transform hover:scale-105"
              >
                Login to Get Started
              </button>
            </div>
          ) : (
            <>
              <InputForm
                userName={userName}
                idea={idea}
                setIdea={setIdea}
                location={location}
                setLocation={setLocation}
                onSubmit={handleGeneratePitch}
                isLoading={isLoading}
              />

              {isLoading && <Loader message="Brewing your pitch..." />}

              {error && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center animate-fade-in-up">
                  <p className="font-bold">Oops! Something went wrong.</p>
                  <p>{error}</p>
                </div>
              )}

              {pitchData && (
                <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <PitchResult data={pitchData} />
                </div>
              )}

              {pitchData && !ratingData && !isRatingLoading && !ratingError && (
                <div className="mt-8 text-center animate-fade-in-up">
                  <button
                    onClick={handleRateIdea}
                    className="px-8 py-3 bg-accent text-dark-text font-bold rounded-lg shadow-lg hover:bg-highlight disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    Rate My Idea's Potential
                  </button>
                </div>
              )}
              
              {isRatingLoading && <Loader message="Analyzing potential..." subMessage="Our AI is crunching the numbers." />}
              
              {ratingError && (
                 <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-center animate-fade-in-up">
                  <p className="font-bold">Couldn't rate the idea.</p>
                  <p>{ratingError}</p>
                </div>
              )}

              {ratingData && (
                <div className="mt-12 animate-fade-in-up">
                    <RatingResult data={ratingData} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {isLoggedIn && (
        <Chatbot 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onToggleHistory={() => setShowHistoryPanel(prev => !prev)}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;
