import React from 'react';
import { useState } from 'react';
import { Menu, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ContentHeader } from 'component/utility/Layout.jsx';
import './MenuBar.scss';
import { useEffect } from 'react';

const MenuBar = (props) => {
    const { handleContentSwitch, handleClick, menuItems, title, defaultSelectedKey } = props
    const [selectedMenuKey, setSelectedMenuKey] = useState(defaultSelectedKey);
    useEffect(() => {
        console.log(`selectedKey: `, selectedMenuKey)
    }, [selectedMenuKey])
    const treeData = [
        {
            title: <ContentHeader title={title} />,
            key: 'controller',
            children: [
                {
                    key: 'menu',
                    title: <>
                        <Menu
                            onClick={(e) => {
                                handleClick(e.key);
                                setSelectedMenuKey(e.key);
                            }}
                            selectedKeys={[selectedMenuKey]}
                            mode="horizontal"
                            items={menuItems}
                        />
                        {
                            handleContentSwitch(selectedMenuKey)
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
            selectable={false}
        />
    );

}

export default MenuBar;