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
    TrademarkOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;


const HomeSider = (props) => {
    const { isCollapsed, toggle } = props;
    const location = useLocation();
    let selectedKeys = [];

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
                    label: (<Link to="bestbuy-list">BestBuy</Link>)
                },
                {
                    disabled: true,
                    key: 'costco-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to="costco-list">CostCo</Link>)
                },
                {
                    key: 'microsoft-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to="microsoft-list">Microsoft</Link>)
                },
                {
                    key: 'walmart-list',
                    icon: <ShoppingOutlined />,
                    label: (<Link to="walmart-list">Walmart</Link>)
                },
                {
                    disabled: true,
                    key: 'price-alert',
                    icon: <MonitorOutlined />,
                    label: (<Link to="price-alert">Price Alert</Link>)
                },
                {
                    disabled: true,
                    key: 'nurse-order',
                    icon: <RobotOutlined />,
                    label: (<Link to="nurse-order"> Nurse Order</Link>)
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
                    label: (<Link to="operation-products-list">Product List</Link>)
                },
                {
                    disabled: true,
                    key: 'configuration',
                    icon: <DesktopOutlined />,
                    label: (<Link to="configuration">Configuration</Link>)
                }
            ]
        },
        {
            key: 'Warehouse',
            icon: <ScanOutlined />,
            label: "Warehouse",
            children: [
                {
                    disabled: true,
                    key: "inbound",
                    icon: <ScanOutlined />,
                    label: (<Link to="inbound">Inbound</Link>)
                },
                {
                    // disabled: true,
                    key: 'outbound',
                    icon: <ScanOutlined />,
                    label: (<Link to="outbound">OutBound</Link>)
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
        <Sider
            trigger={null}
            collapsible
            collapsed={isCollapsed}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => toggle(!broken)}
        >
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