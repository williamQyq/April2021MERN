import React from 'react';
import { useState } from 'react';
import { Menu, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import FileUpload from 'component/utility/FileUpload.jsx';
import { ContentHeader } from 'component/utility/Layout.jsx';

const MenuBar = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");
    const { customizedUpload, handleClick, menuItems, title } = props

    const switchContent = (key) => {
        switch (key) {
            case 'upload':
                return <FileUpload customizedUpload={customizedUpload} />
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
                            onClick={e => {
                                handleClick(e.key);
                                setSelectedMenuKey(e.key);
                            }}
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

export default MenuBar;