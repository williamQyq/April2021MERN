import { Layout } from "antd";
import ProtectedRoutes from 'component/auth/ProtectedRoutes.js';
const { Content } = Layout;

const HomeContent = () => {
    return (
        < Content >
            <ProtectedRoutes />
        </Content >
    )
}

export default HomeContent;