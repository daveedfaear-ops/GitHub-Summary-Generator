
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-3 text-white">Enter Your Gemini API Key</h2>
      <p className="text-gray-400 mb-6">
        To use this application, please provide your own Google Gemini API key. Your key will be saved securely in your browser's local storage.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API Key here..."
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
