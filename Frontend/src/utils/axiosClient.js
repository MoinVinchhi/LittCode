import axios from 'axios'

const axiosClient = axios.create ({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for better error handling
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = 'An unexpected error occurred';
        let shouldShowPopup = !error.config?.headers?.skipErrorPopup; // Allow disabling popup per request

        // Handle network errors
        if (!error.response) {
            errorMessage = 'Network error. Please check your connection.';
            if (window.popupManager && shouldShowPopup) {
                window.popupManager.showNetworkError(errorMessage);
            }
        }
        // Handle server errors (500+)
        else if (error.response.status >= 500) {
            errorMessage = error.response.data?.message || 'Server error. Please try again later.';
            if (window.popupManager && shouldShowPopup) {
                window.popupManager.showServerError(errorMessage);
            }
        }
        // Handle authentication errors (401) - Skip popup for auth endpoints
        else if (error.response.status === 401) {
            errorMessage = error.response.data?.message || 'Authentication required. Please login again.';
            if (window.popupManager && shouldShowPopup && !error.config.url?.includes('/user/')) {
                window.popupManager.showError(errorMessage, 'Authentication Error');
            }
        }
        // Handle authorization errors (403)
        else if (error.response.status === 403) {
            errorMessage = error.response.data?.message || 'You do not have permission to perform this action.';
            if (window.popupManager && shouldShowPopup) {
                window.popupManager.showError(errorMessage, 'Access Denied');
            }
        }
        // Handle not found errors (404)
        else if (error.response.status === 404) {
            errorMessage = error.response.data?.message || 'Resource not found.';
            if (window.popupManager && shouldShowPopup) {
                window.popupManager.showError(errorMessage, 'Not Found');
            }
        }
        // Handle validation errors (400) - Skip popup for auth endpoints
        else if (error.response.status === 400) {
            errorMessage = error.response.data?.message || 'Invalid request data.';
            if (window.popupManager && shouldShowPopup && !error.config.url?.includes('/user/')) {
                window.popupManager.showValidationError(errorMessage);
            }
        }
        // Handle other client errors (4xx)
        else if (error.response.status >= 400) {
            errorMessage = error.response.data?.message || 'Request failed.';
            if (window.popupManager && shouldShowPopup) {
                window.popupManager.showError(errorMessage);
            }
        }
        
        // Attach the formatted message to the error
        error.message = errorMessage;
        
        return Promise.reject(error);
    }
);

export default axiosClient;
