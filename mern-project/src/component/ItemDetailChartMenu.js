import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { LineChartOutlined, AreaChartOutlined, MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

class ChartMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: "Price History",
        }
    }


    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };

    render() {
        const { current } = this.state;
        return (
            <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="Price History" icon={<LineChartOutlined />}>
                    Price History
                </Menu.Item>
                <Menu.Item key="unknown" disabled icon={<AreaChartOutlined />}>
                    OutBound WMS
                </Menu.Item>
            </Menu>
        );
    }

}

export default ChartMenu;