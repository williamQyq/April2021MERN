import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';

import { LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';

export default class OperationMenu extends React.Component {
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
                <Menu.Item key="setting" icon={<LineChartOutlined />}>
                    Settings
                </Menu.Item>
                <Menu.Item key="upload" icon={<AreaChartOutlined />}>
                    Upload
                </Menu.Item>
            </Menu>
        );
    }

}
