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
    CloudDownloadOutlined,
    TrademarkOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;


const HomeSider = (props) => {
    const { path, collapsed } = props;
    let selectedKeys = [];
    const location = useLocation();

    const splitPath = (path) => {
        return path.split('/').pop()
    }

    let menuItemKey = splitPath(location.pathname);
    selectedKeys.push(menuItemKey);

    const menuItems = [
        {
            key: 'Alert',
            icon: <AlertOutlined />,
            label: "Alert",
            children: [
                {
                    key: 'bestbuy-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to={`${path}/bestbuy-list`}>BestBuy</Link>)
                },
                {
                    disabled: true,
                    key: 'costco-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to={`${path}/costco-list`}>CostCo</Link>)
                },
                {
                    key: 'microsoft-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to={`${path}/microsoft-list`}>Microsoft</Link>)
                },
                {
                    key: 'walmart-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to={`${path}/walmart-list`}>Walmart</Link>)
                },
                {
                    disabled: true,
                    key: 'price-alert',
                    icon: <MonitorOutlined />,
                    label: (<Link to={`${path}/price-alert`}>Price Alert</Link>)
                },
                {
                    disabled: true,
                    key: 'nurse-order',
                    icon: <RobotOutlined />,
                    label: (<Link to={`${path}/nurse-order`}> Nurse Order</Link>)
                }
            ]
        },
        {
            key: 'Operation',
            icon: <ScheduleOutlined />,
            label: "Operation",
            children: [
                {
                    key: 'operation-products-list',
                    icon: <ProfileOutlined />,
                    label: (<Link to={`${path}/operation-products-list`}>Product List</Link>)
                },
                {
                    key: 'configuration',
                    icon: <DesktopOutlined />,
                    label: (<Link to={`${path}/configuration`}>Configuration</Link>)
                }
            ]
        },
        {
            key: 'Warehouse',
            icon: <ScanOutlined />,
            label: "Warehouse",
            children: [
                {
                    key: "inbound",
                    icon: <ScanOutlined />,
                    label: (<Link to={`${path}/inbound`}>Inbound</Link>)
                },
                {
                    disabled: true,
                    key: 'outBound',
                    icon: <ScanOutlined />,
                    label: (<Link to={`${path}/outBound`}>OutBound</Link>)
                }
            ]
        },
        {
            key: 'download',
            disabled: true,
            icon: <DownloadOutlined />,
            label: "download",
        }


    ]


    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo">
                <TrademarkOutlined style={{ margin: "auto", fontSize: "48px" }} />
            </div>

            <Menu
                theme="dark"
                mode="inline"
                defaultOpenKeys={['Alert']}
                defaultSelectedKeys={['bestbuy-list']}
                selectedKeys={selectedKeys}
                items={menuItems} />
        </Sider >
    )
}

export default HomeSider;