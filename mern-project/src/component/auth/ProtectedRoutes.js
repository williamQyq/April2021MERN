import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import routes from 'component/auth/AuthenticatedRoutes.js'; // Route list
import ErrorPage from 'component/utility/ErrorPage';

const ProtectedRoutes = () => {
    return (
        <Suspense
            fallback={<ErrorPage />}
        >
            {routes.map(({ component: Component, path, exact }) => (
                <Route
                    path={`/${path}`}
                    key={path}
                    exact={exact}
                >
                    <Component />
                </Route>
            )
            )}
        </Suspense>

    );
}
export default ProtectedRoutes