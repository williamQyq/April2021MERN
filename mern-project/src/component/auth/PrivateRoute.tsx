import React from 'react';
import { Navigate } from 'react-router-dom';

interface IProps {
    children: JSX.Element;
    isAuthenticated: boolean;
}
const PrivateRoute: React.FC<IProps> = ({ children, isAuthenticated }: IProps) => {
    return (
        isAuthenticated ? (
            children
        ) : (
            <Navigate to="/" />
        )
    )
}

export default PrivateRoute;