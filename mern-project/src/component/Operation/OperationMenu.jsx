import React from 'react';
import './Operation.scss';
import { useState } from 'react';
import { Menu, Tree } from 'antd';
import { LineChartOutlined, AreaChartOutlined, DownOutlined } from '@ant-design/icons';
import { Settings } from 'component/Operation/Settings'
import Upload from 'component/Operation/AsinMappingUpload.jsx';
import { ContentHeader } from 'component/utility/Layout.jsx';



const OperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");
    const { title } = props;

    const menuItems = [
        {
            key: 'upload',
            icon: <AreaChartOutlined />,
            label: 'Upload'
        }
    ]


    const switchContent = (key) => {
        switch (key) {
            case 'upload':
                return <Upload />
            default:
                break;
        }
    }

    const treeData = [
        {
            title: <ContentHeader title={title} />,
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
