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
import { GrAmazon } from 'react-icons/gr';
import { CiShoppingTag } from 'react-icons/ci';
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
                    key: "alert",
                    icon: <CiShoppingTag />,
                    label:<Link to="deal-alert">Deal Alert</Link>
                }
            ]
        },
        {
            key: 'Operation',
            icon: <ScheduleOutlined />,
            label: "Operation",
            children: [
                {
                    key: 'operation',
                    icon: <GrAmazon />,
                    label: (<Link to="operation">Amazon</Link>)
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