import React from 'react';
import type { RatingData } from '../types';
import ResultCard from './ResultCard';

interface RatingResultProps {
  data: RatingData;
}

const SectionIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mr-4 text-accent">
        {children}
    </div>
);

const Icons = {
  Rating: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Strength: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Weakness: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Advice: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
};

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const size = 120;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const scoreColor = score > 75 ? 'text-highlight' : score > 50 ? 'text-accent' : 'text-red-400';

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute" width={size} height={size}>
                <circle
                    className="text-secondary/50"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${scoreColor} transition-all duration-1000 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </svg>
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
        </div>
    )
}


const RatingResult: React.FC<RatingResultProps> = ({ data }) => {
  return (
    <ResultCard title="Startup Viability Score" icon={<SectionIcon><Icons.Rating /></SectionIcon>}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex flex-col items-center p-4 rounded-lg">
                <ScoreRing score={data.successScore} />
                <p className="mt-2 text-sm text-accent/80">Success Potential</p>
            </div>
            <div className="flex-1 w-full space-y-6">
                <div>
                    <h4 className="font-semibold text-highlight mb-2">Key Strengths</h4>
                    <ul className="space-y-2">
                        {data.keyStrengths.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Icons.Strength />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold text-red-400 mb-2">Potential Weaknesses</h4>
                    <ul className="space-y-2">
                        {data.potentialWeaknesses.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Icons.Weakness />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-secondary">
             <h4 className="font-semibold text-accent mb-2">Actionable Advice</h4>
                <ul className="space-y-2">
                    {data.actionableAdvice.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Icons.Advice />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
        </div>
    </ResultCard>
  );
};

export default RatingResult;