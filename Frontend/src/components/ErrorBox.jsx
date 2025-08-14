import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorBox = ({ 
  error, 
  onClose, 
  className = "", 
  variant = "error",
  showCloseButton = true 
}) => {
  if (!error) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      default:
        return 'alert-error';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return <AlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />;
      case 'warning':
        return <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>;
      case 'info':
        return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>;
      case 'success':
        return <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      default:
        return <AlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />;
    }
  };

  return (
    <div className={`alert ${getVariantClasses()} shadow-lg ${className}`}>
      <div className="flex-1 flex items-center gap-3">
        {getIcon()}
        <div>
          <span className="font-medium">
            {typeof error === 'string' ? error : error.message || 'An error occurred'}
          </span>
          {error.details && (
            <p className="text-sm opacity-80 mt-1">{error.details}</p>
          )}
        </div>
      </div>
      {showCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Close error message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorBox;
