
import React, { useState } from 'react';
import {
    defaultSettings,
    searchReceivedShipmentColumns,
    searchShipmentColumns,
    searchLocationInventoryColumns
} from 'component/Warehouse/utilities.js';
import DrawerSearch from 'component/utility/DrawerSearch.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getShipment } from 'reducers/actions/outboundActions';
import {
    getInventoryReceivedFromSearch,
    getLocationInventory
} from 'reducers/actions/inboundActions';

const SearchShipment = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(searchShipmentColumns);
    const { items, itemsLoading } = useSelector((state) => state.warehouse.shipmentSearch)


    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log(`Form values:`, values)
                switch (values.type) {
                    case 'outBoundShipment':
                        dispatch(getShipment(values));
                        setColumns(searchShipmentColumns);
                        break;
                    case 'inBoundReceived':
                        dispatch(getInventoryReceivedFromSearch(values))
                        setColumns(searchReceivedShipmentColumns);
                        break;
                    case 'locationInventory':
                        dispatch(getLocationInventory(values));
                        setColumns(searchLocationInventoryColumns);
                        break;
                    default:
                        return;
                }
                setVisible(false)
            })
            .catch(err => { })
    }

    return (

        <FormTable
            data={items}
            columns={columns}
            loading={itemsLoading}
            tableSettings={{
                ...defaultSettings,
                title: () =>
                    <DrawerSearch
                        visible={visible}
                        title="Search my Bean Brain"
                        onSubmit={onSubmit}
                        setVisible={setVisible}
                        form={form}
                    />
            }}
        />
    );

}

export default SearchShipment;