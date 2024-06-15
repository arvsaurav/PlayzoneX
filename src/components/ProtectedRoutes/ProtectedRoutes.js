import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {

    const { isUserAuthenticated, isLoading } = useSelector((state) => state.authentication);

    if(isLoading) {
        return;
    }
    
    return isUserAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
