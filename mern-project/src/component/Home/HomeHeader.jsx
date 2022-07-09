import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout } from "antd";
const { Header } = Layout;

const HomeHeader = (props) => {
    const { toggle, handleLogOut, isCollapsed } = props;

    return (
        <Header className="header" >
            {React.createElement(isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: (e) => {
                    e.preventDefault();
                    toggle(isCollapsed);
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