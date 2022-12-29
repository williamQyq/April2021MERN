import React from 'react';
import 'styles/Operation.scss';
import { useState } from 'react';
import { Menu, Tree } from 'antd';
import { AreaChartOutlined, DownOutlined } from '@ant-design/icons';
import FileUpload from 'component/utility/FileUpload.jsx';
import { uploadAsinsMapping } from 'reducers/actions/operationActions';



const OperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");

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
                return <FileUpload customizedUpload={uploadAsinsMapping} />
            default:
                break;
        }
    }

    const treeData = [
        {
            title: <></>,
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
