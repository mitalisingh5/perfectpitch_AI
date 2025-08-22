import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-secondary/30 backdrop-blur-sm border border-secondary rounded-xl shadow-lg p-6 h-full transition-all duration-300 ease-in-out hover:shadow-[0_0_25px_rgba(0,246,255,0.3)] hover:-translate-y-1">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold text-light-text">{title}</h3>
      </div>
      <div className="prose prose-invert prose-p:text-light-text/90 prose-li:text-light-text/90 max-w-none">
        {children}
      </div>
    </div>
  );
};

export default ResultCard;