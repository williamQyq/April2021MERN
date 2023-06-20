import React from 'react';
import 'antd/dist/antd.min.css';
import { Menu } from 'antd';

import { LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';


const menuItems = [
    {
        icon: <LineChartOutlined />,
        label: "Price History"
    },
    {
        icon: <AreaChartOutlined />,
        label: "OutBound WMS"
    }
]


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
            <Menu
                onClick={this.handleClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={menuItems} />

        );
    }

}

export default ChartMenu;