import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk (
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData, {
                headers: { 'skipErrorPopup': 'true' }
            });
            return response.data.user;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Registration failed. Please try again.';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const loginUser = createAsyncThunk (
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', credentials, {
                headers: { 'skipErrorPopup': 'true' }
            });
            return response.data.user;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Login failed. Please try again.';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const checkAuth = createAsyncThunk (
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get('/user/check', {
                headers: { 'skipErrorPopup': 'true' }
            }); 
            return data.user;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Authentication check failed';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const logoutUser = createAsyncThunk (
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post('/user/logout', {}, {
                headers: { 'skipErrorPopup': 'true' }
            }); 
            return null;
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Logout failed';
            return rejectWithValue({ message: errorMessage });
        }
    }
);

const authSlice = createSlice ({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        success: null
    },
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        
        builder

            //register user cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(registerUser.fulfilled, (state,action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload; //for bool value
                state.user = action.payload;
                state.error = null;
                // Show popup notification
                if (window.popupManager) {
                    window.popupManager.showSignup();
                }
            })
            .addCase(registerUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed. Please try again.';
                state.isAuthenticated = false;
                state.user = null;
                // Show specific error popup
                if (window.popupManager) {
                    const errorMessage = action.payload?.message || 'Registration failed. Please try again.';
                    window.popupManager.showError(errorMessage, 'Registration Failed');
                }
            })

            //login user cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(loginUser.fulfilled, (state,action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload; //for bool value
                state.user = action.payload;
                state.error = null;
                // Show popup notification
                if (window.popupManager) {
                    window.popupManager.showLogin();
                }
            })
            .addCase(loginUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed. Please try again.';
                state.isAuthenticated = false;
                state.user = null;
                // Show specific error popup
                if (window.popupManager) {
                    const errorMessage = action.payload?.message || 'Invalid credentials. Please check your email and password.';
                    window.popupManager.showError(errorMessage, 'Login Failed');
                }
            })
            
            //check auth cases
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(checkAuth.fulfilled, (state,action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload; //for bool value
                state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Authentication check failed';
                state.isAuthenticated = false;
                state.user = null;
                // Don't show popup for auth check failures as they happen silently
            })
            
            //logout user cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                // Show popup notification
                if (window.popupManager) {
                    window.popupManager.showLogout();
                }
            })
            .addCase(logoutUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Logout failed';
                state.isAuthenticated = false;
                state.user = null;
                // Show error popup for logout failure
                if (window.popupManager) {
                    window.popupManager.showError('Logout failed. Please try again.', 'Logout Error');
                }
            })
    }
});

export default authSlice.reducer;
