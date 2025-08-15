import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X,
  LogIn,
  LogOut,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  Play,
  Send,
  Home
} from 'lucide-react';

const PopupNotification = ({ 
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
  action = null
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'login':
        return <LogIn className="w-6 h-6 text-green-500" />;
      case 'logout':
        return <LogOut className="w-6 h-6 text-blue-500" />;
      case 'signup':
        return <UserPlus className="w-6 h-6 text-purple-500" />;
      case 'create':
        return <Plus className="w-6 h-6 text-green-500" />;
      case 'update':
        return <Edit className="w-6 h-6 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-6 h-6 text-red-500" />;
      case 'run':
        return <Play className="w-6 h-6 text-green-500" />;
      case 'submit':
        return <Send className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "relative z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500`;
      case 'error':
        return `${baseStyles} border-red-500`;
      case 'warning':
        return `${baseStyles} border-yellow-500`;
      case 'info':
        return `${baseStyles} border-blue-500`;
      case 'login':
        return `${baseStyles} border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800`;
      case 'logout':
        return `${baseStyles} border-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800`;
      case 'signup':
        return `${baseStyles} border-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800`;
      case 'create':
        return `${baseStyles} border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800`;
      case 'update':
        return `${baseStyles} border-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800`;
      case 'delete':
        return `${baseStyles} border-red-500 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-gray-800`;
      case 'run':
        return `${baseStyles} border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800`;
      case 'submit':
        return `${baseStyles} border-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800`;
      default:
        return `${baseStyles} border-blue-500`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getStyles()} ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {title}
              </p>
            )}
            {message && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className="h-full transition-all duration-300 ease-linear"
            style={{ 
              width: isExiting ? '0%' : '100%',
              transitionDuration: `${duration}ms`,
              backgroundColor: type === 'error' ? '#ef4444' : 
                              type === 'success' ? '#10b981' : 
                              type === 'warning' ? '#f59e0b' : '#3b82f6'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PopupNotification;

