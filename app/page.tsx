'use client';

import { useState } from 'react';
import type { GeneratePromptResponse } from '@/lib/types';
import FeatureTags from './components/FeatureTags';

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

  const wordCount = userInstructions.trim().split(/\s+/).filter(Boolean).length;
  const charCount = userInstructions.length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-linear-to-br from-white via-purple-50 to-pink-50 animate-gradient"></div>
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-lavender-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Prompt Generator
          </h1>
          <p className="text-base md:text-lg text-purple-900/70 max-w-2xl mx-auto">
            Transform your ideas into optimized prompts for vibe coding tools like Lovable, Bolt, and Replit
          </p>
        </header>

        {/* Main Content - Single Column */}
        <div className="max-w-3xl mx-auto">
          {/* State 1: Input Form (show when no prompt and not loading) */}
          {!isLoading && !generatedPrompt && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 glow-purple-light transition-smooth shine-effect animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Instructions
                </h2>
                <div className="text-sm text-purple-700/70 px-3 py-1 rounded-full glass">
                  {wordCount} words · {charCount}/5000
                </div>
              </div>

              <textarea
                value={userInstructions}
                onChange={(e) => setUserInstructions(e.target.value)}
                placeholder="Describe what you want to build... Be as specific as possible!

Example: 'Create a todo app with React and TypeScript. It should have a clean, modern UI with Tailwind CSS. Users can add, edit, delete, and mark todos as complete. Include filtering by status and local storage persistence.'"
                className="w-full h-96 p-5 rounded-2xl resize-none bg-white/50 border-2 border-purple-300/40 text-purple-900 placeholder-purple-400/60 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-300/50 transition-smooth"
                maxLength={5000}
              />

              <FeatureTags
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
              />

              <button
                onClick={handleGenerate}
                disabled={isLoading || !userInstructions.trim()}
                className="w-full mt-6 bg-linear-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-smooth hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(192,132,252,0.4)] active:scale-[0.98] shine-effect"
              >
                <span className="flex items-center justify-center gap-2">
                  ✨ Generate Optimized Prompt
                </span>
              </button>

              {error && (
                <div className="mt-4 p-4 glass-light border-2 border-red-400/40 rounded-2xl text-red-700 animate-scale-in">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* State 2: Loading (show when loading) */}
          {isLoading && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 glow-purple-light min-h-[600px] flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6" style={{boxShadow: '0 0 30px rgba(192, 132, 252, 0.3)'}}></div>
                <p className="text-xl text-purple-700 font-medium">Crafting your perfect prompt...</p>
                <p className="text-sm text-purple-600/60 mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* State 3: Result (show when prompt is generated) */}
          {!isLoading && generatedPrompt && (
            <div className="glass-light rounded-3xl shadow-2xl p-8 glow-purple-light transition-smooth shine-effect animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Generated Prompt
                </h2>
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-smooth text-sm font-medium hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_10px_30px_rgba(74,222,128,0.3)]"
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

              <div className="bg-white/50 rounded-2xl p-5 min-h-[400px] max-h-[500px] overflow-y-auto border-2 border-purple-300/40">
                <pre className="whitespace-pre-wrap text-sm text-purple-900 font-mono leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>

              <button
                onClick={() => {
                  setGeneratedPrompt('');
                  setUserInstructions('');
                  setError('');
                  setSelectedFeatures([]);
                }}
                className="w-full mt-6 bg-linear-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl transition-smooth hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(192,132,252,0.4)] active:scale-[0.98]"
              >
                ✨ Generate New Prompt
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-3xl mx-auto glass-light rounded-3xl shadow-2xl p-8 glow-purple-light shine-effect animate-slide-up" style={{animationDelay: '0.4s'}}>
          <h3 className="text-xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            💡 Tips for Better Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 glass rounded-2xl transition-smooth hover:scale-105 glow-hover-light animate-fade-in" style={{animationDelay: '0.5s'}}>
              <h4 className="font-semibold text-purple-700 mb-2">Be Specific</h4>
              <p className="text-sm text-purple-600/80">
                Include exact features, technologies, and design preferences you want
              </p>
            </div>
            <div className="p-6 glass rounded-2xl transition-smooth hover:scale-105 glow-hover-light animate-fade-in" style={{animationDelay: '0.6s'}}>
              <h4 className="font-semibold text-pink-700 mb-2">Mention Tech Stack</h4>
              <p className="text-sm text-purple-600/80">
                Specify frameworks, libraries, and tools (React, TypeScript, Tailwind, etc.)
              </p>
            </div>
            <div className="p-6 glass rounded-2xl transition-smooth hover:scale-105 glow-hover-light animate-fade-in" style={{animationDelay: '0.7s'}}>
              <h4 className="font-semibold text-purple-700 mb-2">Describe UI/UX</h4>
              <p className="text-sm text-purple-600/80">
                Mention colors, layout, responsiveness, and user interactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
