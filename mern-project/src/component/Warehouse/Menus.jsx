import React from 'react';
import { AreaChartOutlined, CloudSyncOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    downloadInventoryReceivedUploadSample,
    syncFromNeedToShipGsheet,
    updateInventoryReceivedByUpload,
    uploadNeedToShip
} from 'reducers/actions/inboundActions.js';
import MenuBar from 'component/utility/MenuBar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { returnErrors } from 'reducers/actions/errorActions';
import { syncInventoryReceivedWithGsheet } from 'reducers/actions/outboundActions.js';
import FileUpload from 'component/utility/FileUpload.jsx';
import NeedToShipTable from 'component/Warehouse/NeedToShipTable.jsx';

export const NeedToShipMenu = (props) => {
    const { shipmentInfo } = props;
    const dispatch = useDispatch();
    const needToShipMenuItems = [
        {
            key: 'unstantiatedShipment',
            icon: <AreaChartOutlined />,
            label: 'Confirm Shipment'
        },
        {
            key: 'uploadNeedToShip',
            icon: <AreaChartOutlined />,
            label: 'Upload Need To Ship'
        },
        {
            disabled: true,
            key: 'loadFromGsheet',
            icon: <AreaChartOutlined />,
            label: 'Load From Gsheet'
        }
    ]
    const handleClick = (key) => {
        switch (key) {
            case "uploadNeedToShip":
                break;
            case "loadFromGsheet":
                dispatch(syncFromNeedToShipGsheet());
                break;
            default:
                console.warn(`clicked key not found `, key);
                return;
        }
    }

    const handleContentSwitch = (key) => {
        switch (key) {
            case 'unstantiatedShipment':
                return <NeedToShipTable shipmentInfo={shipmentInfo} />
            case 'uploadNeedToShip':
                return <FileUpload customizedUpload={uploadNeedToShip} />
            case 'loadFromGsheet':
                break;
            default:
                return <NeedToShipTable />
        }
    }
    return (
        <MenuBar
            handleClick={handleClick}
            handleContentSwitch={handleContentSwitch}
            menuItems={needToShipMenuItems}
            defaultSelectedKey="unstantiatedShipment"
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
            label: 'Update Received Records by Upload'
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

    const handleContentSwitch = (key) => {
        switch (key) {
            case "upload":
                return <FileUpload customizedUpload={updateInventoryReceivedByUpload} />
            default:
                return;
        }
    }
    return (
        <MenuBar
            handleClick={handleClick}
            handleContentSwitch={handleContentSwitch}
            menuItems={inventoryReceivedMenuItems}
            title="Inventory Received"
        />
    )

}