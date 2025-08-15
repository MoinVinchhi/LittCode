import React, { useState, useCallback } from 'react';
import PopupNotification from './PopupNotification';

const PopupManager = () => {
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((popup) => {
    const id = Date.now() + Math.random();
    const newPopup = { ...popup, id };
    setPopups(prev => [...prev, newPopup]);
    return id;
  }, []);

  const removePopup = useCallback((id) => {
    setPopups(prev => prev.filter(popup => popup.id !== id));
  }, []);

  const clearAllPopups = useCallback(() => {
    setPopups([]);
  }, []);

  const showSuccess = useCallback((message, title = 'Success', duration = 4000) => {
    return addPopup({
      type: 'success',
      title,
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showError = useCallback((message, title = 'Error', duration = 6000) => {
    return addPopup({
      type: 'error',
      title,
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showWarning = useCallback((message, title = 'Warning', duration = 5000) => {
    return addPopup({
      type: 'warning',
      title,
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showInfo = useCallback((message, title = 'Info', duration = 4000) => {
    return addPopup({
      type: 'info',
      title,
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showLogin = useCallback((message = 'Welcome back!', duration = 3000) => {
    return addPopup({
      type: 'login',
      title: 'Login Successful',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showLogout = useCallback((message = 'You have been logged out', duration = 3000) => {
    return addPopup({
      type: 'logout',
      title: 'Logout Successful',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showSignup = useCallback((message = 'Account created successfully!', duration = 3000) => {
    return addPopup({
      type: 'signup',
      title: 'Registration Successful',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showCreate = useCallback((message = 'Problem created successfully!', duration = 3000) => {
    return addPopup({
      type: 'create',
      title: 'Problem Created',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showUpdate = useCallback((message = 'Problem updated successfully!', duration = 3000) => {
    return addPopup({
      type: 'update',
      title: 'Problem Updated',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showDelete = useCallback((message = 'Problem deleted successfully!', duration = 3000) => {
    return addPopup({
      type: 'delete',
      title: 'Problem Deleted',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showRun = useCallback((message = 'Code executed successfully!', duration = 3000) => {
    return addPopup({
      type: 'run',
      title: 'Code Execution',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showSubmit = useCallback((message = 'Code submitted successfully!', duration = 3000) => {
    return addPopup({
      type: 'submit',
      title: 'Code Submission',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showNetworkError = useCallback((message = 'Network error. Please check your connection.', duration = 6000) => {
    return addPopup({
      type: 'error',
      title: 'Network Error',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showValidationError = useCallback((message, duration = 5000) => {
    return addPopup({
      type: 'warning',
      title: 'Validation Error',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  const showServerError = useCallback((message = 'Server error. Please try again later.', duration = 6000) => {
    return addPopup({
      type: 'error',
      title: 'Server Error',
      message,
      duration,
      show: true
    });
  }, [addPopup]);

  // Make the manager available globally
  React.useEffect(() => {
    window.popupManager = {
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLogin,
      showLogout,
      showSignup,
      showCreate,
      showUpdate,
      showDelete,
      showRun,
      showSubmit,
      showNetworkError,
      showValidationError,
      showServerError,
      clearAll: clearAllPopups
    };
  }, [showSuccess, showError, showWarning, showInfo, showLogin, showLogout, showSignup, showCreate, showUpdate, showDelete, showRun, showSubmit, showNetworkError, showValidationError, showServerError, clearAllPopups]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {popups.map((popup, index) => (
        <div
          key={popup.id}
          className="pointer-events-auto fixed"
          style={{
            top: `${1 + (index * 5)}rem`,
            right: '1rem',
            zIndex: 1000 + index
          }}
        >
          <PopupNotification
            {...popup}
            onClose={() => removePopup(popup.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PopupManager;

