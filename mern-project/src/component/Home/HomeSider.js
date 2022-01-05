import React from "react";
import InBound from 'component/InBound.js';
import { Link, useLocation } from "react-router-dom";
import {
    UploadOutlined,
    AlertOutlined,
    MonitorOutlined,
    RobotOutlined,
    BarcodeOutlined,
    BankOutlined,
    ShoppingOutlined,
    ShopOutlined,
    ScheduleOutlined,
    ProfileOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;

const HomeSider = (props) => {
    const { path, collapsed } = props;
    let selectedKeys = [];
    const location = useLocation();
    let menuItemKey = splitPath(location.pathname);
    selectedKeys.push(menuItemKey);

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            {/* <div className="logo">RockyStone</div> */}
            <Menu
                theme="dark"
                mode="inline"
                defaultOpenKeys={['ALERT']}
                defaultSelectedKeys={['BestBuy']}
                selectedKeys={selectedKeys}
            >
                <SubMenu key="ALERT" icon={<AlertOutlined />} title="Alert">
                    <Menu.Item key="bestbuy-list" icon={<ShoppingOutlined />}>
                        <Link to={`${path}/bestbuy-list`}>BestBuy</Link>
                    </Menu.Item>
                    <Menu.Item key="costco-list" disabled icon={<ShoppingOutlined />}>
                        <Link to={`${path}/costco-list`}>CostCo</Link>
                    </Menu.Item>
                    <Menu.Item key="microsoft-list" icon={<ShopOutlined />}>
                        <Link to={`${path}/microsoft-list`}>Microsoft</Link>
                    </Menu.Item>
                    <Menu.Item key="price-alert" icon={<MonitorOutlined />}>
                        <Link to={`${path}/price-alert`}>Price Alert</Link>
                    </Menu.Item>
                    <Menu.Item key="purchase" disabled icon={<RobotOutlined />}>
                        <Link to={`${path}/purchase`}> Purchase</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="Operation" icon={<ScheduleOutlined />} title="Operation">
                    <Menu.Item key='operation-products-list' icon={<ProfileOutlined />}>
                        <Link to={`${path}/operation-products-list`}>Product List</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="WAREHOUSE" icon={<BankOutlined />} title="Warehouse">
                    <Menu.Item key="inbound" icon={<BarcodeOutlined />}>
                        <Link to={`${path}/inbound`}> <InBound /></Link>
                    </Menu.Item>
                    <Menu.Item key="outbound" icon={<BarcodeOutlined />}>Outbound</Menu.Item>
                </SubMenu>
                <Menu.Item key="nav3" icon={<UploadOutlined />}>nav 3</Menu.Item>
            </Menu>
        </Sider>
    )
}

const splitPath = (path) => {
    return path.split('/').pop()
}

export default HomeSider;