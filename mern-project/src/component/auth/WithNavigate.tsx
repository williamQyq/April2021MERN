import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import React, { ComponentType } from 'react';

export interface WithNavigateProps {
    navigate?: NavigateFunction;
    location?: Location;
}
const WithNavigate = <P extends WithNavigateProps>(Component: ComponentType<P>): React.FC<P> => {
    const Wrapper: React.FC<P> = (props) => {
        const navigate = useNavigate();
        const location = useLocation();
        return (
            <Component
                {...props}
                navigate={navigate}
                location={location}
            />
        );
    }
    return Wrapper
}


export default WithNavigate;