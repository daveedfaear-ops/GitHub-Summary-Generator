
import React from 'react';
import { GithubIcon } from './icons/GithubIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <GithubIcon className="w-12 h-12 text-white" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          GitHub Content Summarizer
        </h1>
      </div>
      <p className="text-lg text-gray-400">
        Get AI-powered summaries for any public GitHub repo, issue, or file.
      </p>
    </header>
  );
};

export default Header;
