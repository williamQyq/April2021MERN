import { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from 'component/auth/AuthenticatedRoutes.js'; // Route list
import ErrorPage from 'component/ErrorPage';

const ProtectedRoutes = () => {
    return (
        <Switch>
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
        </Switch>
    );
}

export default ProtectedRoutes;