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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            AI Prompt Generator
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
            Transform your ideas into optimized prompts for vibe coding tools like Lovable, Bolt, and Replit
          </p>
        </header>

        {/* Main Content - Single Column */}
        <div className="max-w-3xl mx-auto">
          {/* State 1: Input Form (show when no prompt and not loading) */}
          {!isLoading && !generatedPrompt && (
            <div className="border-2 border-black rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Your Instructions
                </h2>
                <div className="text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded">
                  {wordCount} words · {charCount}/5000
                </div>
              </div>

              <textarea
                value={userInstructions}
                onChange={(e) => setUserInstructions(e.target.value)}
                placeholder="Describe what you want to build...

Tips for better results:
• Be specific - include exact features, technologies, and design preferences
• Mention tech stack - specify frameworks and libraries (React, TypeScript, etc.)
• Describe UI/UX - mention colors, layout, responsiveness, and interactions"
                className="w-full h-48 p-4 rounded border-2 border-gray-300 resize-none bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black"
                maxLength={5000}
              />

              <FeatureTags
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
              />

              <button
                onClick={handleGenerate}
                disabled={isLoading || !userInstructions.trim()}
                className="w-full mt-6 bg-black text-white font-semibold py-4 px-6 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                Generate Optimized Prompt
              </button>

              {error && (
                <div className="mt-4 p-4 border-2 border-red-500 rounded text-red-700">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* State 2: Loading (show when loading) */}
          {isLoading && (
            <div className="border-2 border-black rounded-lg p-8 min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mb-6"></div>
                <p className="text-xl text-black font-medium">Crafting your perfect prompt...</p>
                <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* State 3: Result (show when prompt is generated) */}
          {!isLoading && generatedPrompt && (
            <div className="border-2 border-black rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Generated Prompt
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-black border-2 border-black rounded text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded text-sm font-medium"
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded border-2 border-gray-300 p-5 min-h-[400px] max-h-[500px] overflow-y-auto prose prose-sm max-w-none">
                <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
              </div>

              <button
                onClick={() => {
                  setGeneratedPrompt('');
                  setUserInstructions('');
                  setError('');
                  setSelectedFeatures([]);
                }}
                className="w-full mt-6 bg-black text-white font-semibold py-4 px-6 rounded hover:bg-gray-800"
              >
                Generate New Prompt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
