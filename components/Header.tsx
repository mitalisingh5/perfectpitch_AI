import React from 'react';

interface HeaderProps {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginClick, onLogout }) => {
  return (
    <header className="container mx-auto py-8 px-4 flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-highlight to-accent">
          PitchPerfect AI
        </h1>
        <p className="mt-2 text-lg text-accent/80">
          Transform your raw ideas into a professional business pitch in seconds.
        </p>
      </div>
      <div>
        {isLoggedIn ? (
          <button 
            onClick={onLogout}
            className="px-5 py-2 bg-secondary/50 border border-secondary text-light-text font-semibold rounded-lg shadow-md hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={onLoginClick}
            className="px-5 py-2 bg-accent text-dark-text font-bold rounded-lg shadow-lg hover:bg-highlight transition-colors duration-300"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;