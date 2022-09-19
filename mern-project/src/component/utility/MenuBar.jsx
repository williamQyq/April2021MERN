import React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'styles/MenuBar.scss';

const MenuBar = (props) => {
    const { handleContentSwitch, handleClick, menuItems, defaultSelectedKey } = props
    const [selectedMenuKey, setSelectedMenuKey] = useState(defaultSelectedKey);
    useEffect(() => {
        console.log(`selectedKey: `, selectedMenuKey)
    }, [selectedMenuKey])
    const treeData = [
        {
            title: "Open More Options",
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