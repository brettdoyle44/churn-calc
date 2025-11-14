/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner with multiple size variants and optional text label.
 * 
 * USAGE EXAMPLES:
 * 
 * // Small inline spinner
 * <LoadingSpinner size="sm" />
 * 
 * // Loading button
 * <button disabled>
 *   <LoadingSpinner size="sm" />
 *   <span className="ml-2">Saving...</span>
 * </button>
 * 
 * // Full page loading
 * <div className="min-h-screen flex items-center justify-center">
 *   <LoadingSpinner size="lg" text="Generating your analysis..." />
 * </div>
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '' 
}: LoadingSpinnerProps) {
  // Size variants: sm (16px), md (24px), lg (48px)
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',      // 16px
    md: 'h-6 w-6 border-2',      // 24px
    lg: 'h-12 w-12 border-4',    // 48px
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`.trim()}>
      {/* Spinning circle with border-t-transparent */}
      <div className="relative">
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            border-indigo-600 
            border-t-transparent 
            animate-spin
          `}
        />
      </div>
      
      {/* Optional text label */}
      {text && (
        <p className="text-gray-600 text-sm font-medium text-center">
          {text}
        </p>
      )}
    </div>
  );
}
