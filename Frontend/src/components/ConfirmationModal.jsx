import React from 'react';
import { AlertTriangle, X, Trash2, Info, AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'danger', 'warning', 'info'
  loading = false,
  customIcon = null
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'danger':
        return <Trash2 className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'info':
        return <Info className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-warning';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-base-content">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-base-content text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-base-300">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${getButtonStyles()} ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
