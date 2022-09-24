import React from 'react';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children, isAuthenticated }) => {
    return (
        isAuthenticated ? (
            children
        ) : (
            <Navigate to="/" />
        )
    )
}

export default PrivateRoute;