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
    isComplete,
  } = useCalculator();

  // Local state for AI loading status
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  /**
   * PROTECTION: Redirect to home if calculator data is incomplete
   */
  useEffect(() => {
    if (!isComplete) {
      navigate('/');
      return;
    }
  }, [isComplete, navigate]);

  /**
   * Set page title and metadata
   */
  useEffect(() => {
    if (userInfo) {
      document.title = `${userInfo.storeName} - Churn Analysis Results | ChurnGuard`;
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
  if (!isComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ChurnGuard</span>
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
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors no-print"
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🤖 AI-Powered Retention Strategy
            </h2>
            <p className="text-lg text-gray-600">
              Personalized recommendations generated just for {userInfo?.storeName}
            </p>
          </div>

          {/* LOADING STATE */}
          {aiLoading && (
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-12 animate-pulse">
              <div className="text-center space-y-6">
                <LoadingSpinner size="lg" />
                <div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
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
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-8">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 mt-6">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 mt-4">
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
                          className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
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
                        <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700 my-4">
                          {children}
                        </blockquote>
                      ),
                      // Style code blocks
                      code: ({ children }) => (
                        <code className="bg-gray-100 text-indigo-600 px-2 py-1 rounded text-sm font-mono">
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
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to stop the revenue leak?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              ChurnGuard automates everything in this strategy—from at-risk detection to win-back campaigns
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <button
                onClick={() => window.open('https://churnguard.com/demo', '_blank')}
                className="w-full md:w-auto bg-white text-indigo-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Book a Demo
              </button>
              <button
                onClick={() => window.open('https://churnguard.com/early-access', '_blank')}
                className="w-full md:w-auto bg-transparent text-white font-semibold px-8 py-4 rounded-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Get Early Access
              </button>
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
