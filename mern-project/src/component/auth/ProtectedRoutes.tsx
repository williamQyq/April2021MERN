import React from 'react';
import { useRoutes } from 'react-router-dom';
import routesConfig from './AuthenticatedRoutes'; // Route list
import LoadingPage from '@src/component/utils/LoadingPage.jsx';

const ProtectedRoutes = () => {
    const routes = useRoutes(routesConfig);

    return (
        <React.Suspense fallback={<LoadingPage />}>
            {routes}
        </React.Suspense>

    );
}
export default ProtectedRoutes