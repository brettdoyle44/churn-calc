import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useCalculator } from '../contexts/CalculatorContext';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateChurnAnalysis } from '../utils/aiAnalysis';
import { categorizeStore } from '../utils/calculations';
import { generateFallbackAnalysis } from '../utils/fallbackAnalysis';

/**
 * ResultsPage Component
 * 
 * Displays calculator results and generates personalized AI-powered retention strategies.
 * 
 * Features:
 * - Protected route - redirects to home if no calculator data
 * - Shows all results from ResultsDisplay component
 * - Loads AI analysis progressively
 * - Displays AI analysis with markdown rendering
 * - Handles fallback if AI fails
 * - Scroll to AI section once loaded
 * - Print-friendly styles
 * - Responsive design
 */
export default function ResultsPage() {
  const navigate = useNavigate();
  const {
    calculatorInputs,
    calculatorResults,
    userInfo,
    aiAnalysis,
    setAiAnalysis,
    clearCalculator,
  } = useCalculator();

  // Local state for AI loading status
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  /**
   * PROTECTION: Redirect to home if calculator data is incomplete
   * Note: We only check for inputs, results, and userInfo - NOT aiAnalysis
   * because aiAnalysis is generated on this page
   */
  useEffect(() => {
    if (!calculatorInputs || !calculatorResults || !userInfo) {
      navigate('/');
      return;
    }
  }, [calculatorInputs, calculatorResults, userInfo, navigate]);

  /**
   * Set page title and metadata
   */
  useEffect(() => {
    if (userInfo) {
      document.title = `${userInfo.storeName} - Churn Analysis Results | Voyage`;
    }
  }, [userInfo]);

  /**
   * Load AI analysis on mount if not already loaded
   */
  useEffect(() => {
    if (!calculatorInputs || !calculatorResults || !userInfo) return;
    if (aiAnalysis) return; // Already loaded

    loadAIAnalysis();
  }, []); // Empty dependency array - run only on mount

  /**
   * AI Analysis Loading Logic
   */
  async function loadAIAnalysis() {
    setAiLoading(true);
    setAiError(false);

    try {
      const analysis = await generateChurnAnalysis(
        calculatorInputs!,
        calculatorResults!,
        userInfo!
      );
      setAiAnalysis(analysis);

      // Scroll to AI section smoothly once loaded
      setTimeout(() => {
        aiSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    } catch (error) {
      console.error('AI generation failed:', error);
      setAiError(true);

      // Use fallback
      const storeProfile = categorizeStore(calculatorInputs!, calculatorResults!);
      const fallback = generateFallbackAnalysis(
        calculatorInputs!,
        calculatorResults!,
        userInfo!,
        storeProfile
      );

      setAiAnalysis({
        content: fallback,
        generatedAt: new Date().toISOString(),
        model: 'fallback-template',
        fallbackUsed: true,
      });
    } finally {
      setAiLoading(false);
    }
  }

  /**
   * Handle "Start Over" action
   */
  const handleStartOver = () => {
    clearCalculator();
    navigate('/');
  };

  /**
   * Format date for display
   */
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Don't render anything if redirecting
  if (!calculatorInputs || !calculatorResults || !userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="font-display font-black text-2xl text-voyage-navy">
              voyage<span className="text-voyage-seafoam">_</span>
            </div>
          </div>

          {/* Center: Store Name */}
          <div className="hidden md:block text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Analysis for {userInfo?.storeName}
            </h1>
          </div>

          {/* Right: Start Over Link */}
          <button
            onClick={handleStartOver}
            className="px-6 py-2 border-2 border-voyage-ocean text-voyage-ocean hover:bg-voyage-ocean hover:text-white font-semibold rounded-full transition-all no-print"
          >
            Start Over
          </button>
        </div>

        {/* Mobile: Store Name */}
        <div className="md:hidden px-4 pb-3">
          <h1 className="text-base font-semibold text-gray-900 text-center">
            Analysis for {userInfo?.storeName}
          </h1>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* SECTION 1: Results Display */}
        <ResultsDisplay
          inputs={calculatorInputs!}
          results={calculatorResults!}
          userInfo={userInfo!}
        />

        {/* SECTION 2: AI Analysis */}
        <section ref={aiSectionRef} id="ai-analysis-section" className="mt-12">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-voyage-navy mb-4">
              🤖 AI-Powered Retention Strategy
            </h2>
            <p className="text-xl text-gray-600">
              Personalized recommendations generated just for <span className="font-semibold text-voyage-ocean">{userInfo?.storeName}</span>
            </p>
          </div>

          {/* LOADING STATE */}
          {aiLoading && (
            <div className="bg-gradient-to-br from-voyage-cream via-white to-voyage-cream rounded-2xl p-12 border border-voyage-seafoam/20 animate-pulse">
              <div className="text-center space-y-6">
                <LoadingSpinner size="lg" />
                <div>
                  <p className="text-xl font-semibold text-voyage-navy mb-2">
                    Analyzing your churn situation...
                  </p>
                  <p className="text-gray-600">
                    This takes about 10-15 seconds...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI CONTENT DISPLAY */}
          {!aiLoading && aiAnalysis && (
            <div className="space-y-6">
              {/* Error Warning Banner (if fallback was used) */}
              {aiError && aiAnalysis.fallbackUsed && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">⚠️</span>
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                        AI analysis temporarily unavailable
                      </h3>
                      <p className="text-yellow-700">
                        We've generated a comprehensive analysis using our proven templates.
                        The recommendations below are still highly relevant and actionable.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Markdown Content Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <article className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      // Style headers
                      h1: ({ children }) => (
                        <h1 className="text-3xl md:text-4xl font-display font-black text-voyage-navy mb-6 mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-voyage-navy mb-4 mt-8">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl md:text-2xl font-display font-semibold text-voyage-navy mb-3 mt-6">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg md:text-xl font-display font-semibold text-voyage-navy mb-2 mt-4">
                          {children}
                        </h4>
                      ),
                      // Style paragraphs
                      p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      // Style lists
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-6 mb-4 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700 leading-relaxed">
                          {children}
                        </li>
                      ),
                      // Style bold text
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      // Style links
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-voyage-ocean hover:text-voyage-seafoam hover:underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      // Style horizontal rules
                      hr: () => (
                        <hr className="my-8 border-t-2 border-gray-200" />
                      ),
                      // Style blockquotes
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-voyage-seafoam pl-4 italic text-gray-700 my-4 bg-voyage-cream/30 py-2">
                          {children}
                        </blockquote>
                      ),
                      // Style code blocks
                      code: ({ children }) => (
                        <code className="bg-voyage-cream text-voyage-ocean px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {aiAnalysis.content}
                  </ReactMarkdown>
                </article>

                {/* Footer: Generated date */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Generated {aiAnalysis.fallbackUsed ? 'using proven templates' : 'by AI'} on{' '}
                    {formatDate(aiAnalysis.generatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: Footer CTA */}
        <section className="mt-16 mb-8">
          <div className="bg-gradient-to-br from-voyage-navy via-voyage-ocean to-voyage-navy rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-voyage-seafoam rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-voyage-coral rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to stop the revenue leak?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Voyage automates everything in this strategy—from at-risk detection to win-back campaigns
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <button
                  onClick={() => window.open('mailto:hello@voyage.com?subject=Demo%20Request', '_blank')}
                  className="w-full md:w-auto bg-gradient-to-r from-voyage-coral to-voyage-sunset text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Book a Demo
                </button>
                <button
                  onClick={handleStartOver}
                  className="w-full md:w-auto bg-transparent text-white font-semibold px-8 py-4 rounded-full border-2 border-white hover:bg-white hover:text-voyage-navy transition-all duration-300"
                >
                  Calculate Again
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          header {
            position: relative !important;
          }
          .shadow-md,
          .shadow-lg,
          .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #e5e7eb;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
