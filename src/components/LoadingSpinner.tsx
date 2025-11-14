interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'lg', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = size === 'lg' ? 'flex items-center justify-center p-12' : '';

  return (
    <div className={`${containerClasses} ${className}`.trim()}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-gray-200`}></div>
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-indigo-600 border-t-transparent animate-spin`}></div>
      </div>
    </div>
  );
}

