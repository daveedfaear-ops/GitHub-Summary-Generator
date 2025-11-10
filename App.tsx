
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import UrlInputForm from './components/UrlInputForm';
import SummaryDisplay from './components/SummaryDisplay';
import ApiKeyForm from './components/ApiKeyForm';
import { getContent } from './services/githubService';
import { summarizeContent } from './services/geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [summaryTitle, setSummaryTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey(null);
  };

  const handleSummarize = useCallback(async () => {
    if (!apiKey) {
      setError('API Key is not set. Please set your API key first.');
      return;
    }
    if (!url) {
      setError('Please enter a GitHub URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');
    setSummaryTitle('');

    try {
      const { content, name, type } = await getContent(url);
      
      if (!content) {
        throw new Error('Could not retrieve content from the provided GitHub URL. It might be a private repository or an invalid link.');
      }
      
      const generatedSummary = await summarizeContent(content, type, name, apiKey);
      setSummaryTitle(name);
      setSummary(generatedSummary);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Add a check for common API key errors
        if (err.message.includes('API key not valid')) {
            setError('Your API key is not valid. Please check it and try again.');
            handleClearApiKey(); // Clear the invalid key
        } else {
            setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, apiKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl">
        <Header apiKeySet={!!apiKey} onClearApiKey={handleClearApiKey} />
        <main>
          {!apiKey ? (
            <ApiKeyForm onKeySubmit={handleSetApiKey} />
          ) : (
            <>
              <UrlInputForm
                url={url}
                setUrl={setUrl}
                onSubmit={handleSummarize}
                isLoading={isLoading}
              />
              <SummaryDisplay
                title={summaryTitle}
                summary={summary}
                isLoading={isLoading}
                error={error}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
