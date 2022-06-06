import React from 'react';
import { AreaChartOutlined, CloudSyncOutlined } from '@ant-design/icons';
import {
    uploadInventoryReceived,
    uploadNeedToShip
} from 'reducers/actions/inboundActions.js';
import MenuBar from 'component/utility/MenuBar.jsx';

export const NeedToShipMenu = () => {
    const needToShipMenuItems = [
        {
            key: 'upload',
            icon: <AreaChartOutlined />,
            label: 'Upload'
        }
    ]
    return (
        <MenuBar
            customizedUpload={uploadNeedToShip}
            menuItems={needToShipMenuItems}
            title="Need To Ship"
        />
    )
}


export const InventoryReceivedMenu = () => {

    const inventoryReceivedMenuItems = [
        {
            key: 'upload',
            icon: <AreaChartOutlined />,
            label: 'Upload'
        },
        {
            key: 'syncInventoryReceived',
            icon: <CloudSyncOutlined />,
            label: "Sync Inventory Received"
        }
    ]

    const handleClick = (key) => {

    }

    return (
        <MenuBar
            handleClick={handleClick}
            customizedUpload={uploadInventoryReceived}
            menuItems={inventoryReceivedMenuItems}
            title="Inventory Received"
        />
    )

}