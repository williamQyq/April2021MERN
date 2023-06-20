import React, { useState } from 'react';
import { AreaChartOutlined, CloudSyncOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {
    downloadInventoryReceivedUploadSample,
    updateInventoryReceivedByUpload,
} from '@redux-action//inboundActions.js';
import { useDispatch, useSelector } from 'react-redux';
import { returnErrors } from '@src/redux/actions/errorActions';
import { syncInventoryReceivedWithGsheet } from '@redux-action//outboundActions.js';
import FileUpload from '@src/component/utils/FileUploader';
import { BsUiChecksGrid } from 'react-icons/bs';
import { Collapse, Menu } from 'antd';

const { Panel } = Collapse;

const InventoryReceivedControlPanel = () => {
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

    const [menuKey, setMenuKey] = useState("upload");

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
        <Collapse accordion ghost collapsible='header'>
            <Panel
                header={<BsUiChecksGrid style={{ fontSize: "200%" }} />}
                key="1"
            >
                <Menu
                    onClick={(e) => {
                        handleClick(e.key);
                        setMenuKey(e.key);
                    }}
                    selectedKeys={menuKey}
                    mode="horizontal"
                    items={inventoryReceivedMenuItems}
                />
                {
                    handleContentSwitch(menuKey)
                }
            </Panel>
        </Collapse >
    )

}

export default InventoryReceivedControlPanel;