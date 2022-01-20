import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout } from "antd";
const { Header } = Layout;

const HomeHeader = (props) => {
    const { toggle, handleLogOut, isCollapsed } = props;
    const [collapsed, setCollapsed] = useState(isCollapsed);

    return (
        <Header className="site-layout-background">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: (e) => {
                    e.preventDefault();
                    setCollapsed(!collapsed);
                    toggle(collapsed);
                    
                },
            })}
            <LogoutOutlined onClick={(e) => {
                e.preventDefault();
                handleLogOut();
            }} />
        </Header>
    )
}

export default HomeHeader;