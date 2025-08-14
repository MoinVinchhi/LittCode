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
        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your connection.';
        }
        // Handle server errors
        else if (error.response.status >= 500) {
            error.message = 'Server error. Please try again later.';
        }
        // Handle client errors
        else if (error.response.status >= 400) {
            error.message = error.response.data || 'Request failed.';
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;
