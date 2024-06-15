import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserAuthenticated: false,
    userData: null,
    isLoading: true
}

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isUserAuthenticated = true;
            state.userData = action.payload;
            state.isLoading = false;
        },
        logout: (state) => {
            state.isUserAuthenticated = false;
            state.userData = null;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { login, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;