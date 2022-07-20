import React from 'react';
import { AreaChartOutlined, CloudSyncOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    downloadInventoryReceivedUploadSample,
    updateInventoryReceivedByUpload,
    uploadNeedToShip
} from 'reducers/actions/inboundActions.js';
import MenuBar from 'component/utility/MenuBar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { returnErrors } from 'reducers/actions/errorActions';
import { syncInventoryReceivedWithGsheet } from 'reducers/actions/outboundActions.js';

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
    const dispatch = useDispatch();
    const isInventoryReceivedLoading = useSelector((state) => state.warehouse.inventoryReceivedLoading);

    const inventoryReceivedMenuItems = [
        {
            key: 'upload',
            icon: <AreaChartOutlined />,
            label: 'Update Existing Records by Upload'
        },
        {
            key: 'syncInventoryReceived',
            icon: isInventoryReceivedLoading ? <LoadingOutlined /> : <CloudSyncOutlined />,
            label: "Sync Inventory Received"
        }, {
            key: 'downloadSampleXlsx',
            icon: <DownloadOutlined />,
            label: "Download Sample Excel"
        }
    ]

    const handleClick = (key) => {
        switch (key) {
            case "syncInventoryReceived":
                dispatch(syncInventoryReceivedWithGsheet());
                break;
            case "downloadSampleXlsx":
                dispatch(downloadInventoryReceivedUploadSample());
                break;
            case "upload":
                break;
            default:
                let msg = `${key} failed.`
                let status = 400;
                dispatch(returnErrors(msg, status))
                return;
        }
    }

    return (
        <MenuBar
            handleClick={handleClick}
            customizedUpload={updateInventoryReceivedByUpload}
            menuItems={inventoryReceivedMenuItems}
            title="Inventory Received"
        />
    )

}