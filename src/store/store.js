import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authenticationSlice";

const store = configureStore({
    reducer: {
        authentication: authSlice
    }
});

export default store;