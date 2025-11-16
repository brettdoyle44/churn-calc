import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CalculatorProvider } from './contexts/CalculatorContext';
import CalculatorPage from './pages/CalculatorPage';
import ResultsPage from './pages/ResultsPage';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleStartOver = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="max-w-md w-full card-mercury text-center">
            <div className="text-warning-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold text-navy-950 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-navy-600 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <div className="bg-mercury-50 rounded-mercury p-3 mb-6 text-left">
                <p className="text-sm text-navy-700 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleStartOver}
              className="w-full btn-mercury-primary"
            >
              Start Over
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <CalculatorProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<CalculatorPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </CalculatorProvider>
  );
}

export default App;
