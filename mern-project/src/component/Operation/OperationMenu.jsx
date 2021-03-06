import React from 'react';
import './Operation.scss';
import { useState } from 'react';
import { Menu, Row, Tree } from 'antd';
import { LineChartOutlined, AreaChartOutlined, DownOutlined } from '@ant-design/icons';
import { Settings } from 'component/Operation/Settings'
import Upload from 'component/Operation/AsinMappingUpload';

const OperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");

    const switchContent = (key) => {
        switch (key) {
            case 'settings':
                return <Settings {...props} />
            case 'upload':
                return <Upload />
            default:
                break;
        }
    }

    const setContent = (expandedKeys, { expanded, node }) => {
        console.log(node)
    }
    const treeData = [
        {
            title: 'Controller',
            key: 'controller',
            children: [
                {
                    key: 'menu',
                    title: <>
                        <Menu
                            onClick={e => setSelectedMenuKey(e.key)}
                            selectedKeys={[selectedMenuKey]}
                            mode="horizontal"
                        >
                            <Menu.Item key="settings" icon={<LineChartOutlined />}>
                                Settings
                            </Menu.Item>
                            <Menu.Item key="upload" icon={<AreaChartOutlined />}>
                                Upload
                            </Menu.Item>
                        </Menu >
                        {
                            switchContent(selectedMenuKey)
                        }
                    </>
                }
            ]
        }
    ]

    return (
        <Tree
            showIcon
            blockNode
            onExpand={setContent}
            defaultSelectedKeys={['controller']}
            switcherIcon={< DownOutlined />}
            treeData={treeData}
        />

    );

}

export default OperationMenu;
