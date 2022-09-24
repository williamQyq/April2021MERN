import { useLocation, useNavigate } from "react-router-dom";

const WithNavigate = (Component) => {
    const Wrapper = (props) => {
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
    return Wrapper;
}


export default WithNavigate;