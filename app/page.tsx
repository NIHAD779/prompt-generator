'use client';

import { useState } from 'react';
import type { GeneratePromptResponse } from '@/lib/types';
import FeatureTags from './components/FeatureTags';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [userInstructions, setUserInstructions] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleToggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleGenerate = async () => {
    if (!userInstructions.trim()) {
      setError('Please enter your instructions');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');
    setCopySuccess(false);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInstructions,
          selectedFeatures,
        }),
      });

      const data: GeneratePromptResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      if (data.success && data.generatedPrompt) {
        setGeneratedPrompt(data.generatedPrompt);
      } else {
        throw new Error('No prompt generated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleReset = () => {
    setGeneratedPrompt('');
    setCopySuccess(false);
    setSelectedFeatures([]);
    setUserInstructions('');
  };

  const wordCount = userInstructions.trim().split(/\s+/).filter(Boolean).length;
  const charCount = userInstructions.length;

  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-4xl flex-1 flex flex-col overflow-hidden pb-16 sm:pb-20">
        {/* Header */}
        <header className="text-center mb-3 sm:mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-2 sm:mb-4 font-sans">
            Heal My Prompt
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto px-2 sm:px-0">
            Transform your ideas into optimized prompts for vibe coding tools like Lovable, Bolt, and Replit
          </p>
        </header>

        {/* Main Content - Single Column */}
        <main className="max-w-4xl mx-auto flex-1 overflow-y-auto" role="main">
          {/* State 1: Input Form (show when no prompt and not loading) */}
          {!isLoading && !generatedPrompt && (
            <article className="border-2 border-black rounded-lg p-4 sm:p-6" aria-labelledby="input-heading">
              <div className="mb-3 sm:mb-4">
                <h2 id="input-heading" className="text-xl sm:text-2xl font-semibold text-black">
                  What do you want to build?
                </h2>
              </div>

              <textarea
                value={userInstructions}
                onChange={(e) => setUserInstructions(e.target.value)}
                placeholder="Describe what you want to build..."
                className="w-full h-32 sm:h-40 p-3 sm:p-4 text-sm sm:text-base rounded border-2 border-gray-300 resize-none bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black"
                maxLength={5000}
                aria-label="Enter your project instructions"
                aria-describedby="input-tips"
              />

              <FeatureTags
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
              />

              <button
                onClick={handleGenerate}
                disabled={isLoading || !userInstructions.trim()}
                className="w-full mt-4 bg-black text-white font-semibold py-3 px-6 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 min-h-[44px] text-sm sm:text-base"
                aria-label="Generate optimized prompt from your instructions"
              >
                Generate Optimized Prompt
              </button>

              {error && (
                <div className="mt-4 p-3 sm:p-4 border-2 border-red-500 rounded text-red-700 text-sm sm:text-base" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}
            </article>
          )}

          {/* State 2: Loading (show when loading) */}
          {isLoading && (
            <section className="border-2 border-black rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[200px]" role="status" aria-live="polite">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-black border-t-transparent mb-4 sm:mb-6" aria-hidden="true"></div>
                <p className="text-lg sm:text-xl text-black font-medium">Crafting your perfect prompt...</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">This may take a few moments</p>
              </div>
            </section>
          )}

          {/* State 3: Result (show when prompt is generated) */}
          {!isLoading && generatedPrompt && (
            <article className="border-2 border-black rounded-lg p-4 sm:p-6" aria-labelledby="result-heading">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
                <h2 id="result-heading" className="text-xl sm:text-2xl font-semibold text-black">
                  Generated Prompt
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-100 text-black border-2 border-black rounded text-sm font-medium min-h-[44px] flex-1 sm:flex-initial"
                    aria-label="Reset form and start over"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-black hover:bg-gray-800 text-white rounded text-sm font-medium min-h-[44px] flex-1 sm:flex-initial"
                    aria-label={copySuccess ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded border-2 border-gray-300 p-3 sm:p-4 overflow-y-auto prose prose-sm max-w-none text-sm sm:text-base" style={{maxHeight: 'calc(100vh - 280px)'}} role="region" aria-label="Generated prompt content">
                <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
              </div>

              <button
                onClick={() => {
                  setGeneratedPrompt('');
                  setUserInstructions('');
                  setError('');
                  setSelectedFeatures([]);
                }}
                className="w-full mt-4 bg-black text-white font-semibold py-3 px-6 rounded hover:bg-gray-800 min-h-[44px] text-sm sm:text-base"
                aria-label="Clear results and generate a new prompt"
              >
                Generate New Prompt
              </button>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
