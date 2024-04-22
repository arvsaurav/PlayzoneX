import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserAuthenticated: false,
    userData: null
}

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isUserAuthenticated = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.isUserAuthenticated = false;
            state.userData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;