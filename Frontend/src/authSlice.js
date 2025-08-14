import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk (
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData); //mention the API we want to hit
            return response.data.user;
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const loginUser = createAsyncThunk (
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', credentials);
            return response.data.user;
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const checkAuth = createAsyncThunk (
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get('/user/check'); 
            return data.user;
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk (
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post('/user/logout'); 
            return null;
        }
        catch (error) {
            return rejectWithValue(error);
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
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
                // Show error popup
                if (window.popupManager) {
                    window.popupManager.showError(action.payload?.message || 'Registration failed. Please try again.');
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
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
                // Show error popup
                if (window.popupManager) {
                    window.popupManager.showError(action.payload?.message || 'Login failed. Please try again.');
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
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
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
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.user = null;
            })
    }
});

export default authSlice.reducer;
