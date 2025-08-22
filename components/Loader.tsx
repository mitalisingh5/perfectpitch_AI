import React from 'react';

interface LoaderProps {
  message?: string;
  subMessage?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = 'Brewing your pitch...', 
  subMessage = 'This might take a moment.' 
}) => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="relative w-16 h-16">
            <div className="absolute border-4 border-t-accent border-secondary/50 rounded-full w-full h-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
        </div>
        <p className="mt-4 text-accent text-lg">{message}</p>
        <p className="text-sm text-accent/70">{subMessage}</p>
    </div>
  );
};

export default Loader;