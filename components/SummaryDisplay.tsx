
import React from 'react';

interface SummaryDisplayProps {
  title: string;
  summary: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ title, summary, isLoading, error }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 min-h-[200px] transition-all duration-300">
      {isLoading && <LoadingSkeleton />}
      {error && (
        <div className="text-red-400 flex flex-col items-center justify-center h-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && summary && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">
            Summary for <span className="font-mono text-indigo-400">{title}</span>
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</p>
        </div>
      )}
      {!isLoading && !error && !summary && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold">Your summary will appear here.</p>
            <p className="text-sm">Enter a GitHub URL above and click "Summarize" to start.</p>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;
