// Error handling utilities for the application

export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  // If custom message is provided, show it
  if (customMessage && window.popupManager) {
    window.popupManager.showError(customMessage);
    return customMessage;
  }
  
  // Extract error message from various sources
  const errorMessage = 
    error?.response?.data?.message || 
    error?.message || 
    'An unexpected error occurred';
  
  return errorMessage;
};

export const validateFormData = (data, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    const fieldNames = missingFields.join(', ');
    const message = `Please fill in the following required fields: ${fieldNames}`;
    
    if (window.popupManager) {
      window.popupManager.showValidationError(message);
    }
    
    return { isValid: false, message };
  }
  
  return { isValid: true };
};

export const showSuccessMessage = (type, customMessage = null) => {
  if (!window.popupManager) return;
  
  switch (type) {
    case 'login':
      window.popupManager.showLogin(customMessage);
      break;
    case 'logout':
      window.popupManager.showLogout(customMessage);
      break;
    case 'signup':
      window.popupManager.showSignup(customMessage);
      break;
    case 'create':
      window.popupManager.showCreate(customMessage);
      break;
    case 'update':
      window.popupManager.showUpdate(customMessage);
      break;
    case 'delete':
      window.popupManager.showDelete(customMessage);
      break;
    case 'run':
      window.popupManager.showRun(customMessage);
      break;
    case 'submit':
      window.popupManager.showSubmit(customMessage);
      break;
    default:
      window.popupManager.showSuccess(customMessage || 'Operation completed successfully');
  }
};

export const handleNetworkError = () => {
  if (window.popupManager) {
    window.popupManager.showNetworkError();
  }
};

export const handleValidationError = (message) => {
  if (window.popupManager) {
    window.popupManager.showValidationError(message);
  }
};

export const handleServerError = (message = null) => {
  if (window.popupManager) {
    window.popupManager.showServerError(message);
  }
};
