import React from 'react';

const LoadingSpinner = ({ 
  size = 'lg', 
  message = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'loading-sm';
      case 'md':
        return 'loading-md';
      case 'lg':
        return 'loading-lg';
      case 'xl':
        return 'loading-xl';
      default:
        return 'loading-lg';
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <span className={`loading loading-spinner ${getSizeClass()}`}></span>
      {message && (
        <p className="text-base-content text-sm opacity-70">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-base-200 bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64 w-full">
      {content}
    </div>
  );
};

export default LoadingSpinner;
