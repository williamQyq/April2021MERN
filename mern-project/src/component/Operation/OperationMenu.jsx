import React from 'react';
import './Operation.scss';
import { useState } from 'react';
import { Menu, Tree } from 'antd';
import { LineChartOutlined, AreaChartOutlined, DownOutlined } from '@ant-design/icons';
import { Settings } from 'component/Operation/Settings'
import Upload from 'component/Operation/AsinMappingUpload';



const OperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");

    const menuItems = [
        {
            key: 'settings',
            icon: <LineChartOutlined />,
            label: 'Settings',
        },
        {
            key: 'upload',
            icon: <AreaChartOutlined />,
            label: 'Upload'
        }
    ]


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
                            items={menuItems}
                        />
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
            defaultSelectedKeys={['controller']}
            switcherIcon={< DownOutlined />}
            treeData={treeData}
        />

    );

}

export default OperationMenu;
