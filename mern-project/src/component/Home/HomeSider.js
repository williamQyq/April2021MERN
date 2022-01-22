import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    AlertOutlined,
    MonitorOutlined,
    RobotOutlined,
    ShoppingOutlined,
    ScheduleOutlined,
    ProfileOutlined,
    DesktopOutlined,
    ScanOutlined,
    CloudDownloadOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
const { SubMenu } = Menu;

const HomeSider = (props) => {
    const { path, collapsed } = props;
    let selectedKeys = [];
    const location = useLocation();

    const splitPath = (path) => {
        return path.split('/').pop()
    }

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
                    <Menu.Item key="microsoft-list" icon={<ShoppingOutlined />}>
                        <Link to={`${path}/microsoft-list`}>Microsoft</Link>
                    </Menu.Item>
                    <Menu.Item key="price-alert" disabled icon={<MonitorOutlined />}>
                        <Link to={`${path}/price-alert`}>Price Alert</Link>
                    </Menu.Item>
                    <Menu.Item key="purchase" disabled icon={<RobotOutlined />}>
                        <Link to={`${path}/nurse-order`}> Nurse Order</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="Operation" icon={<ScheduleOutlined />} title="Operation">
                    <Menu.Item key='operation-products-list' icon={<ProfileOutlined />}>
                        <Link to={`${path}/operation-products-list`}>Product List</Link>
                    </Menu.Item>
                    <Menu.Item key='Configuration' icon={<DesktopOutlined />}>
                        <Link to={`${path}/configuration`}>Configuration</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="WAREHOUSE" icon={<ScanOutlined />} title="Warehouse">
                    <Menu.Item key="inbound" icon={<ScanOutlined />}>
                        <Link to={`${path}/inbound`}>Inbound</Link>
                    </Menu.Item>
                    <Menu.Item key="outbound" disabled icon={<ScanOutlined />}>Outbound</Menu.Item>
                </SubMenu>
                <Menu.Item key="nav3" disabled icon={<CloudDownloadOutlined />}>nav 3</Menu.Item>
            </Menu>
        </Sider>
    )
}

export default HomeSider;