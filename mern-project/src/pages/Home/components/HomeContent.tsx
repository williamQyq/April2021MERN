import React from "react";
import { Layout } from "antd";
import ProtectedRoutes from '@src/component/auth/ProtectedRoutes';

const HomeContent: React.FC = () => {
    return (
        < Layout.Content >
            <ProtectedRoutes />
        </Layout.Content >
    )
}

export default HomeContent;