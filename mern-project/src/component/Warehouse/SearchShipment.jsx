
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DrawerSearch from 'component/utility/DrawerSearch.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import {
    defaultSettings,
    searchReceivedShipmentColumns,
    searchShipmentColumns,
    searchLocationInventoryColumns
} from 'component/Warehouse/utilities.js';
import { downloadShipment, getShipment } from 'reducers/actions/outboundActions.js';
import {
    downloadInventoryReceived,
    downloadLocationInventory,
    getInventoryReceivedFromSearch,
    getLocationInventory
} from 'reducers/actions/inboundActions';
import {
    SEARCH_LOCATION_INVENTORY,
    SEARCH_OUTBOUND_SHIPMENT,
    SEARCH_RECEIVAL_SHIPMENT
} from 'reducers/actions/types.js';

const SearchShipment = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(searchShipmentColumns);
    const { items, itemsLoading, category } = useSelector((state) => state.warehouse.shipmentSearch)


    useEffect(() => {
        let hasItems = items.length > 0 ? true : false;
        if (!hasItems) {
            dispatch(getShipment({}));
        }
        handleColumnsOnSearchCategoryChange(category);
    }, [category, items, dispatch])

    const handleDataOnSearchCategoryChange = (category, values) => {
        switch (category) {
            case SEARCH_OUTBOUND_SHIPMENT:
                dispatch(getShipment(values));
                break;
            case SEARCH_RECEIVAL_SHIPMENT:
                dispatch(getInventoryReceivedFromSearch(values))
                break;
            case SEARCH_LOCATION_INVENTORY:
                dispatch(getLocationInventory(values));
                break;
            default:
                return;
        }
    }
    const handleColumnsOnSearchCategoryChange = (category) => {
        switch (category) {
            case SEARCH_OUTBOUND_SHIPMENT:
                setColumns(searchShipmentColumns);
                break;
            case SEARCH_RECEIVAL_SHIPMENT:
                setColumns(searchReceivedShipmentColumns);
                break;
            case SEARCH_LOCATION_INVENTORY:
                setColumns(searchLocationInventoryColumns);
                break;
            default:
                return;
        }
    }

    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log(`Form values:`, values)
                handleColumnsOnSearchCategoryChange(values.type);
                handleDataOnSearchCategoryChange(values.type, values);
                setVisible(false)
            })
            .catch(err => { })
    }

    const handleDownload = () => {
        form.validateFields()
            .then((values) => {
                let category = values.type;
                switch (category) {
                    case SEARCH_OUTBOUND_SHIPMENT:
                        dispatch(downloadShipment(values));
                        break;
                    case SEARCH_RECEIVAL_SHIPMENT:
                        dispatch(downloadInventoryReceived(values));
                        break;
                    case SEARCH_LOCATION_INVENTORY:
                        dispatch(downloadLocationInventory(values));
                        break;
                    default:
                        return;
                }
            })
    }

    return (

        <FormTable
            data={items}
            columns={columns}
            loading={itemsLoading}
            tableSettings={{
                ...defaultSettings,
                title: () =>
                    <div style={{ width: "100%" }}>
                        <DrawerSearch
                            visible={visible}
                            title="Search my Bean Brain"
                            onSubmit={onSubmit}
                            setVisible={setVisible}
                            form={form}
                        />
                        <DownloadOutlined onClick={handleDownload} style={{ alignSelf: "center", float: "right", lineHeight: "32px" }} />
                    </div>
            }}
        />
    );

}

export default SearchShipment;