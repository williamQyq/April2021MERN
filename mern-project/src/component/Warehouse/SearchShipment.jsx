
import React, { useState, useEffect } from 'react';
import { defaultSettings, searchShipmentColumns } from 'component/Warehouse/utilities.js';
import DrawerSearch from 'component/utility/DrawerSearch.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import { Form } from 'antd';
import { useDispatch } from 'react-redux';

const SearchShipment = () => {

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([])
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {

    }, [data])

    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log(`Form values:`, values)
                dispatch()
                setVisible(false)
            })
            .catch(err => { })
    }

    return (

        <FormTable
            data={data}
            columns={searchShipmentColumns}
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