'use client';

import { useState, useEffect } from 'react';
import type { GeneratePromptResponse, CsrfTokenResponse, Suggestion } from '@/lib/types';
import FeatureTags from './components/FeatureTags';
import QuickSuggestions from './components/QuickSuggestions';
import WizardHeader from './components/WizardHeader';
import Footer from './components/Footer';
import { useRateLimit } from '@/lib/useRateLimit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Screen = 'selection' | 'form' | 'result';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('selection');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [userInstructions, setUserInstructions] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number>(0);
  const [userEmail, setUserEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showCsrfErrorModal, setShowCsrfErrorModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasPromptBeenCopied, setHasPromptBeenCopied] = useState(false);

  // Use the rate limit hook
  const { rateLimitStatus, checkCanGenerate, incrementUsage, getTimeUntilReset } = useRateLimit();

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf');
        if (response.ok) {
          const data: CsrfTokenResponse = await response.json();
          setCsrfToken(data.token);
        }
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
      }
    };

    fetchCsrfToken();
  }, []);

  const navigateToScreen = (screen: Screen, direction: 'left' | 'right') => {
    setIsTransitioning(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 500);
  };

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

    if (!csrfToken) {
      setError('Security token not available. Please refresh the page.');
      return;
    }

    // Check rate limit BEFORE making API call
    const rateLimitCheck = checkCanGenerate();
    if (!rateLimitCheck.allowed) {
      setRateLimitResetTime(rateLimitCheck.resetTime);
      setShowRateLimitModal(true);
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
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ 
          userInstructions,
          selectedFeatures,
        }),
      });

      const data = await response.json() as GeneratePromptResponse;

      if (!response.ok) {
        // Handle CSRF token errors - fetch new token and auto-retry
        if (response.status === 403 && data.error?.includes('CSRF')) {
          // Fetch a new CSRF token
          const csrfResponse = await fetch('/api/csrf');
          if (csrfResponse.ok) {
            const csrfData: CsrfTokenResponse = await csrfResponse.json();
            setCsrfToken(csrfData.token);
            
            // Automatically retry the request with the new token
            try {
              const retryResponse = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': csrfData.token,
                },
                body: JSON.stringify({ 
                  userInstructions,
                  selectedFeatures,
                }),
              });
              
              const retryData = await retryResponse.json() as GeneratePromptResponse;
              
              if (retryResponse.ok && retryData.success && retryData.generatedPrompt) {
                setGeneratedPrompt(retryData.generatedPrompt);
                
                // Increment usage count in localStorage
                incrementUsage();
                
                // Fetch a new CSRF token for the next request
                const newCsrfResponse = await fetch('/api/csrf');
                if (newCsrfResponse.ok) {
                  const newCsrfData: CsrfTokenResponse = await newCsrfResponse.json();
                  setCsrfToken(newCsrfData.token);
                }
                
                // Navigate to result screen
                navigateToScreen('result', 'left');
                return;
              }
            } catch (retryErr) {
              console.error('Retry failed:', retryErr);
            }
          }
          
          // Only show modal if retry fails
          setShowCsrfErrorModal(true);
          return;
        }
        
        throw new Error(data.error || 'Failed to generate prompt');
      }

      if (data.success && data.generatedPrompt) {
        setGeneratedPrompt(data.generatedPrompt);
        
        // Increment usage count in localStorage
        incrementUsage();
        
        // Fetch a new CSRF token for the next request
        const csrfResponse = await fetch('/api/csrf');
        if (csrfResponse.ok) {
          const csrfData: CsrfTokenResponse = await csrfResponse.json();
          setCsrfToken(csrfData.token);
        }
        
        // Navigate to result screen
        navigateToScreen('result', 'left');
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
      setHasPromptBeenCopied(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleUseSuggestion = (suggestion: Suggestion) => {
    setUserInstructions(suggestion.userInstructions);
    setSelectedFeatures(suggestion.selectedFeatures);
    setError('');
    navigateToScreen('form', 'left');
  };

  const handleSelectCustom = () => {
    setUserInstructions('');
    setSelectedFeatures([]);
    setError('');
    navigateToScreen('form', 'left');
  };

  const handleStepClick = (screen: Screen) => {
    // Determine slide direction based on navigation
    const direction = screen === 'selection' || (screen === 'form' && currentScreen === 'result') ? 'right' : 'left';
    navigateToScreen(screen, direction);
  };

  const handleGenerateNew = () => {
    setGeneratedPrompt('');
    setUserInstructions('');
    setSelectedFeatures([]);
    setError('');
    setIsEditMode(false);
    setHasPromptBeenCopied(false);
    navigateToScreen('selection', 'right');
  };

  const handleResetToHome = () => {
    setGeneratedPrompt('');
    setUserInstructions('');
    setSelectedFeatures([]);
    setError('');
    setIsEditMode(false);
    setHasPromptBeenCopied(false);
    setCopySuccess(false);
    navigateToScreen('selection', 'right');
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      // Send email to backend
      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      if (response.ok) {
        setEmailSubmitted(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting access request:', err);
      alert('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top Bar - Only show on form and result screens */}
      {(currentScreen === 'form' || currentScreen === 'result') && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white py-4 px-4 sm:py-6 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <WizardHeader 
              currentScreen={currentScreen}
              hasGeneratedPrompt={!!generatedPrompt}
              hasPromptBeenCopied={hasPromptBeenCopied}
              onStepClick={handleStepClick}
            />
          </div>
        </div>
      )}

      {/* Rate Limit Modal */}
      {showRateLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 max-w-md w-full border-2 border-black max-h-[90vh] overflow-y-auto">
            {!emailSubmitted ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">Daily Limit Reached</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                  You've used all 3 free prompts for today. Your limit will reset in{' '}
                  <span className="font-semibold">{getTimeUntilReset(rateLimitResetTime)}</span>.
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                  Need more access? Reach out to us with your email and we'll get you set up with increased limits!
                </p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-black text-black text-sm sm:text-base"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white font-semibold py-2.5 sm:py-2 px-4 rounded hover:bg-gray-800 text-sm sm:text-base"
                    >
                      Request Access
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRateLimitModal(false);
                        setUserEmail('');
                      }}
                      className="flex-1 bg-white text-black font-semibold py-2.5 sm:py-2 px-4 rounded border-2 border-black hover:bg-gray-100 text-sm sm:text-base"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">Thank You!</h2>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    We've received your request for increased access. We'll reach out to <span className="font-semibold break-all">{userEmail}</span> shortly!
                  </p>
                  <button
                    onClick={() => {
                      setShowRateLimitModal(false);
                      setEmailSubmitted(false);
                      setUserEmail('');
                    }}
                    className="w-full bg-black text-white font-semibold py-2.5 sm:py-2 px-4 rounded hover:bg-gray-800 text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CSRF Error Modal */}
      {showCsrfErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 max-w-md w-full border-2 border-black">
            <div className="text-center">
              <div className="mb-3 sm:mb-4 flex justify-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">Security Token Expired</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                Your security token has expired. A new token has been generated. Please try submitting your request again.
              </p>
              <button
                onClick={() => setShowCsrfErrorModal(false)}
                className="w-full bg-black text-white font-semibold py-2.5 sm:py-2 px-4 rounded hover:bg-gray-800 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Slide Container */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center py-8" role="main">
        {/* Selection Screen */}
        <div 
          className={`slide-screen flex items-center justify-center ${
            currentScreen === 'selection' 
              ? 'slide-enter-active' 
              : slideDirection === 'left' 
                ? 'slide-exit-left' 
                : 'slide-exit-right'
          }`}
          style={{
            display: currentScreen === 'selection' || isTransitioning ? 'flex' : 'none',
          }}
        >
          <QuickSuggestions 
            onSelectSuggestion={handleUseSuggestion}
            onSelectCustom={handleSelectCustom}
          />
        </div>

        {/* Form Screen */}
        <div 
          className={`slide-screen flex items-center justify-center ${
            currentScreen === 'form' 
              ? 'slide-enter-active' 
              : slideDirection === 'left' 
                ? 'slide-exit-left' 
                : 'slide-exit-right'
          }`}
          style={{
            display: currentScreen === 'form' || isTransitioning ? 'flex' : 'none',
            paddingTop: '7rem',
          }}
        >
          <div className="w-full max-w-4xl mx-auto px-4">
            {/* Form Content */}
            {isLoading ? (
              <section className="border-2 border-black rounded-lg p-6 sm:p-8 flex items-center justify-center min-h-[400px] sm:min-h-[600px]" role="status" aria-live="polite">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-black border-t-transparent mb-4 sm:mb-6" aria-hidden="true"></div>
                  <p className="text-lg sm:text-xl text-black font-medium">Crafting your perfect prompt...</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">This may take a few moments</p>
                </div>
              </section>
            ) : (
              <article className="border-2 border-black rounded-lg p-6 sm:p-8 min-h-[400px] sm:min-h-[600px] flex flex-col" aria-labelledby="input-heading">
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 sm:mb-4">
                    <h2 id="input-heading" className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
                      Describe your project
                    </h2>
                  </div>

                  <textarea
                    value={userInstructions}
                    onChange={(e) => setUserInstructions(e.target.value)}
                    placeholder="Describe what you want to build..."
                    className="w-full h-36 sm:h-48 p-3 sm:p-4 text-sm sm:text-base rounded border-2 border-gray-300 resize-none bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black"
                    maxLength={5000}
                    aria-label="Enter your project instructions"
                  />

                  <FeatureTags
                    selectedFeatures={selectedFeatures}
                    onToggleFeature={handleToggleFeature}
                  />
                </div>

                <div className="mt-auto pt-6">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !userInstructions.trim()}
                    className="w-full bg-black text-white font-semibold py-4 px-6 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 text-base"
                    aria-label="Generate optimized prompt from your instructions"
                  >
                    Generate Optimized Prompt
                  </button>

                  {error && (
                    <div className="mt-4 p-4 border-2 border-red-500 rounded text-red-700 text-base" role="alert" aria-live="assertive">
                      {error}
                    </div>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>

        {/* Result Screen */}
        <div 
          className={`slide-screen flex items-center justify-center ${
            currentScreen === 'result' 
              ? 'slide-enter-active' 
              : slideDirection === 'left' 
                ? 'slide-exit-left' 
                : 'slide-exit-right'
          }`}
          style={{
            display: currentScreen === 'result' || isTransitioning ? 'flex' : 'none',
            paddingTop: '7rem',
          }}
        >
          <div className="w-full max-w-4xl mx-auto px-4">
            {/* Result Content */}
            <article className="border-2 border-black rounded-lg p-6 sm:p-8 min-h-[400px] sm:min-h-[600px] flex flex-col" aria-labelledby="result-heading">
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h2 id="result-heading" className="text-xl sm:text-2xl md:text-3xl font-semibold text-black">
                    Generated Prompt
                  </h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleToggleEditMode}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-gray-100 text-black rounded text-sm sm:text-base font-medium border-2 border-black"
                      aria-label={isEditMode ? "Preview rendered prompt" : "Edit prompt"}
                    >
                      {isEditMode ? (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Done
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black hover:bg-gray-800 text-white rounded text-sm sm:text-base font-medium"
                      aria-label={copySuccess ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
                    >
                      {copySuccess ? (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  {isEditMode ? 'Edit the prompt below before copying it' : 'Click Edit to modify the prompt'}
                </p>

                {isEditMode ? (
                  <textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="w-full h-56 sm:h-80 p-4 border-2 border-gray-300 rounded bg-white text-black font-mono text-xs sm:text-sm resize-none focus:outline-none focus:border-black overflow-y-auto"
                    aria-label="Edit generated prompt"
                  />
                ) : (
                  <div className="w-full h-56 sm:h-80 p-4 border-2 border-gray-300 rounded bg-white text-black overflow-y-auto markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedPrompt}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6">
                <button
                  onClick={handleGenerateNew}
                  className="w-full bg-white text-black font-semibold py-3 sm:py-4 px-6 rounded border-2 border-black hover:bg-gray-100 text-sm sm:text-base"
                  aria-label="Generate a new prompt"
                >
                  Generate New Prompt
                </button>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer onLogoClick={handleResetToHome} />
    </div>
  );
}
