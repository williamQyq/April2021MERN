import { Switch } from 'react-router-dom'
import { Layout } from "antd";
import ProtectedRoutes from 'component/auth/ProtectedRoutes.js';
const { Content } = Layout;

const HomeContent = () => {
    return (
        < Content className="site-layout-content" >
            <Switch>
                <ProtectedRoutes />
            </Switch>
        </Content >
    )
}

export default HomeContent;