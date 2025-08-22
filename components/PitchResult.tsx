import React from 'react';
import type { PitchData } from '../types';
import ResultCard from './ResultCard';

interface PitchResultProps {
  data: PitchData;
}

const SectionIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mr-4 text-accent">
        {children}
    </div>
);

const Icons = {
  Tagline: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 5a2 2 0 000 4h5a2 2 0 000-4H7z" /></svg>,
  ElevatorPitch: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  ValueProposition: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  SlideBullets: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Competitors: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.921" /></svg>,
  RevenueModels: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

const PitchResult: React.FC<PitchResultProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <ResultCard title="Tagline" icon={<SectionIcon><Icons.Tagline /></SectionIcon>}>
        <p className="text-2xl font-bold italic text-highlight">"{data.tagline}"</p>
      </ResultCard>

      <div className="grid md:grid-cols-2 gap-8">
        <ResultCard title="Elevator Pitch" icon={<SectionIcon><Icons.ElevatorPitch /></SectionIcon>}>
          <div className="space-y-4">
            <ul className="space-y-2 list-disc list-inside marker:text-accent">
              {data.elevatorPitch.summaryPoints.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
            <p className="text-light-text/90">{data.elevatorPitch.fullText}</p>
          </div>
        </ResultCard>
        <ResultCard title="Value Proposition" icon={<SectionIcon><Icons.ValueProposition /></SectionIcon>}>
           <div className="space-y-4">
            <ul className="space-y-2 list-disc list-inside marker:text-accent">
              {data.valueProposition.summaryPoints.map((point, index) => <li key={index}>{point}</li>)}
            </ul>
            <p className="text-light-text/90">{data.valueProposition.fullText}</p>
          </div>
        </ResultCard>
      </div>

      <ResultCard title="Pitch Deck Bullets" icon={<SectionIcon><Icons.SlideBullets /></SectionIcon>}>
        <ul className="space-y-3 list-disc list-inside text-light-text/90 marker:text-accent">
          {data.slideBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
        </ul>
      </ResultCard>

      <ResultCard title="Competitor Analysis" icon={<SectionIcon><Icons.Competitors /></SectionIcon>}>
        <div className="space-y-4">
          {data.competitors.map((competitor, index) => (
            <div key={index}>
              <h4 className="font-semibold text-accent">{competitor.name}</h4>
              <p className="text-sm text-light-text/80">{competitor.description}</p>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Potential Revenue Models" icon={<SectionIcon><Icons.RevenueModels /></SectionIcon>}>
        <div className="space-y-4">
          {data.revenueModels.map((model, index) => (
            <div key={index}>
              <h4 className="font-semibold text-accent">{model.name}</h4>
              <p className="text-sm text-light-text/80">{model.description}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
};

export default PitchResult;