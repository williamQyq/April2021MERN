import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routesConfig from 'component/auth/AuthenticatedRoutes.js'; // Route list
import LoadingPage from 'component/utility/LoadingPage.jsx';

const ProtectedRoutes = () => {
    const routes = useRoutes(routesConfig);

    return (
        <Suspense fallback={<LoadingPage />}>
            {routes}
        </Suspense>

    );
}
export default ProtectedRoutes