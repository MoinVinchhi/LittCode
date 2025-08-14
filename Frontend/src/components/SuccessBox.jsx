import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessBox = ({ 
  message, 
  onClose, 
  className = "", 
  showCloseButton = true 
}) => {
  if (!message) return null;

  return (
    <div className={`alert alert-success shadow-lg ${className}`}>
      <div className="flex-1 flex items-center gap-3">
        <CheckCircle className="stroke-current flex-shrink-0 h-6 w-6" />
        <div>
          <span className="font-medium">{message}</span>
        </div>
      </div>
      {showCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Close success message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SuccessBox;
