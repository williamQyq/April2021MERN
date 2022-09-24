import { Layout } from "antd";
import ProtectedRoutes from 'component/auth/ProtectedRoutes.js';
const { Content } = Layout;

const HomeContent = () => {
    return (
        < Content className="site-layout-content" >
            <ProtectedRoutes />
        </Content >
    )
}

export default HomeContent;