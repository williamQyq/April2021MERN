import React from 'react';
import 'antd/dist/antd.css';
import { useState } from 'react';
import { Menu } from 'antd';
import { LineChartOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Settings } from 'component/Operation/Settings'
import Upload from './AsinMappingUpload';

const OperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("settings");
    const { handler, state } = props;

    const handleClick = e => {
        // console.log('click ', e);
        setSelectedMenuKey(e.key);
    };

    const renderSwitch = (key) => {
        switch (key) {
            case 'settings':
                return <Settings {...props} />
            case 'upload':
                return <Upload />
            default:
                break;
        }
    }
    return (
        <>
            <Menu onClick={e => handleClick(e)} selectedKeys={[selectedMenuKey]} mode="horizontal">
                <Menu.Item key="settings" icon={<LineChartOutlined />}>
                    Settings
                </Menu.Item>
                <Menu.Item key="upload" icon={<AreaChartOutlined />}>
                    Upload
                </Menu.Item>
            </Menu >
            {
                renderSwitch(selectedMenuKey)
            }
        </>
    );

}

export default OperationMenu;
