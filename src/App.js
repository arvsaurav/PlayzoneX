import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import authService from './services/AuthenticationService';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/authenticationSlice';

function App() {

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        async function getCurrentUserData() {
            const userData = await authService.getCurrentUser();
            if(userData) {
                dispatch(login(userData));
            }
            else {
                dispatch(logout());
            }
            setLoading(false);
        }
        getCurrentUserData();
    }, [dispatch, loading]);

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default App;