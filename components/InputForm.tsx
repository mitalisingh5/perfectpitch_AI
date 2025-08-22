import React from 'react';

interface InputFormProps {
  userName: string;
  idea: string;
  setIdea: (idea: string) => void;
  location: string;
  setLocation: (location: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ userName, idea, setIdea, location, setLocation, onSubmit, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        if(!isLoading) {
            onSubmit();
        }
    }
  };

  return (
    <div className="w-full p-6 bg-secondary/30 backdrop-blur-sm border border-secondary rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-[0_0_25px_rgba(0,246,255,0.3)] hover:-translate-y-1">
      <label htmlFor="idea-input" className="block text-lg font-medium text-light-text mb-2">
        Enter Your Startup Idea
      </label>
      <p className="text-sm text-accent/80 mb-4">
        Hi {userName}, use a few bullet points to describe your idea.
      </p>
      <textarea
        id="idea-input"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your business idea. What problem does it solve? Who is it for? How does it work?"
        className="w-full h-40 p-3 bg-primary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 resize-none placeholder:text-accent/50"
        disabled={isLoading}
      />
       <div className="mt-4">
        <label htmlFor="location-input" className="block text-sm font-medium text-light-text mb-1">
            Your City or Region (Optional)
        </label>
        <input
            id="location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., San Francisco, CA"
            className="w-full p-2 bg-primary/50 border border-secondary rounded-lg focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors duration-200 placeholder:text-accent/50"
            disabled={isLoading}
        />
        <p className="text-xs text-accent/70 mt-1">Providing a location helps find local competitors.</p>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xs text-accent/70 mb-2 sm:mb-0">
            Press <kbd className="font-sans border border-secondary rounded px-1.5 py-0.5">Ctrl</kbd> + <kbd className="font-sans border border-secondary rounded px-1.5 py-0.5">Enter</kbd> to submit
        </p>
        <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-accent text-dark-text font-bold rounded-lg shadow-lg hover:bg-highlight disabled:bg-secondary disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center animate-pulse-glow"
            >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-text" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
                </>
            ) : (
                'Generate Pitch'
            )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;