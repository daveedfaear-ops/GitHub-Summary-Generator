
import React from 'react';
import { GithubIcon } from './icons/GithubIcon';

interface HeaderProps {
  apiKeySet: boolean;
  onClearApiKey: () => void;
}

const Header: React.FC<HeaderProps> = ({ apiKeySet, onClearApiKey }) => {
  return (
    <header className="text-center mb-8 relative">
      <div className="flex justify-center items-center gap-4 mb-4">
        <GithubIcon className="w-12 h-12 text-white" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          GitHub Content Summarizer
        </h1>
      </div>
      <p className="text-lg text-gray-400">
        Get AI-powered summaries for any public GitHub repo, issue, or file.
      </p>
      {apiKeySet && (
        <div className="absolute top-0 right-0">
          <button
            onClick={onClearApiKey}
            className="px-3 py-2 bg-gray-700 text-sm text-gray-300 font-semibold rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
          >
            Change Key
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
