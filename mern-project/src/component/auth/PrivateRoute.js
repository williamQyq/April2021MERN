import React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ children, isAuthenticated, ...rest }) => {
    return (
        <Route
            {...rest}
            render={
                ({ location }) =>
                    isAuthenticated ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    )

}

export default PrivateRoute;