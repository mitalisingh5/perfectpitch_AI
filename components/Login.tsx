import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    setError(null);
    onLogin(name);
  };

  return (
    <div className="fixed inset-0 bg-primary/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{animationDuration: '0.3s'}}>
      <div className="relative w-full max-w-md p-8 bg-primary border border-secondary rounded-xl shadow-2xl m-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-accent/80 hover:text-highlight transition-colors" aria-label="Close login modal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-highlight to-accent mb-2">
          Welcome!
        </h2>
        <p className="text-center text-accent/80 mb-6">Let's get you started with PitchPerfect AI.</p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-light-text mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ada Lovelace"
              className="w-full p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 placeholder:text-accent/50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-text mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 placeholder:text-accent/50"
            />
          </div>
          <div>
            <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-light-text mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 placeholder:text-accent/50"
            />
          </div>
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-light-text mb-2">
                How did you hear about us?
            </label>
            <select
                id="source"
                className="w-full p-3 bg-secondary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200"
            >
                <option>Social Media</option>
                <option>A Friend or Colleague</option>
                <option>Hackathon Event</option>
                <option>Google Search</option>
                <option>Other</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
          <button
            type="submit"
            className="w-full px-8 py-3 bg-accent text-dark-text font-bold rounded-lg shadow-lg hover:bg-highlight transition-all duration-300 mt-2 !mb-4"
          >
            Get Started
          </button>
        </form>
        <p className="text-xs text-accent/70 mt-6 text-center">
            This is a simulated login. Your information is not stored.
        </p>
      </div>
    </div>
  );
};

export default Login;