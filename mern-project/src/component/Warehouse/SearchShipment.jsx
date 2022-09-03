
import React, { useState, useEffect } from 'react';
import { defaultSettings, searchShipmentColumns } from 'component/Warehouse/utilities.js';
import DrawerSearch from 'component/utility/DrawerSearch.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import { Form } from 'antd';
import { useDispatch } from 'react-redux';
import { getShipment } from 'reducers/actions/outboundActions';
import { getInventoryReceived } from 'reducers/actions/inboundActions';
import { useSelector } from 'react-redux';

const SearchShipment = () => {

    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const { shipmentItems, itemsLoading } = useSelector((state) => state.warehouse.shipment)
    const [form] = Form.useForm();

    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log(`Form values:`, values)
                switch (values.type) {
                    case 'outBoundShipment':
                        dispatch(getShipment(values))
                        break;
                    case 'inBoundReceived':
                        dispatch(getInventoryReceived(values))
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
            data={shipmentItems}
            columns={searchShipmentColumns}
            loading={itemsLoading}
            tableSettings={{
                ...defaultSettings,
                title: () =>
                    <DrawerSearch
                        visible={visible}
                        title="Search Shipment"
                        onSubmit={onSubmit}
                        setVisible={setVisible}
                        form={form}
                    />
            }}
        />
    );

}

export default SearchShipment;