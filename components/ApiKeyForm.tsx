import React, { useState } from 'react';

interface ApiKeyFormProps {
  onKeySubmit: (apiKey: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sm:p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-white">Welcome! Your API Key is Required</h2>
      <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
        This application runs in your browser and uses the Google Gemini API to generate summaries. To protect your privacy and give you full control, you must provide your own API key.
      </p>
      
      <div className="text-left bg-gray-900/50 p-4 rounded-md mb-6 max-w-md mx-auto">
         <ul className="list-none space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-1 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            <span>Your key is stored <strong className="font-semibold text-white">securely in your browser's local storage</strong>.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 mr-2 mt-1 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            <span>It is <strong className="font-semibold text-white">never sent to any server except Google's</strong> for API requests.</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API Key here..."
          className="w-full max-w-md px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-200 placeholder-gray-500"
        />
        <button
          type="submit"
          className="w-full max-w-md px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed"
          disabled={!apiKey.trim()}
        >
          Save and Continue
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-6">
        You can get a free API key from{' '}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};

export default ApiKeyForm;
