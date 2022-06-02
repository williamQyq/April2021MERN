import React from 'react';
import { AreaChartOutlined } from '@ant-design/icons';
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
        }
    ]
    return (
        <MenuBar
            customizedUpload={uploadInventoryReceived}
            menuItems={inventoryReceivedMenuItems}
            title="Inventory Received"
        />
    )

}