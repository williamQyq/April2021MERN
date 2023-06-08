import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DrawerSearch from '@src/component/utils/DrawerSearch.jsx';
import FormTable from '@src/component/utils/FormTable';
import {
    defaultSettings,
    searchReceivedShipmentColumns,
    searchShipmentColumns,
    searchLocationInventoryColumns,
    searchSellerInventoryColumns
} from '@view/Warehouse/util';
import { downloadShipment, getShipment } from '@redux-action/outboundActions.js';
import {
    downloadInventoryReceived,
    downloadLocationInventory,
    getInventoryReceivedFromSearch,
    getLocationInventory,
    getSellerInventory
} from '@redux-action//inboundActions';
import {
    SEARCH_LOCATION_INVENTORY,
    SEARCH_OUTBOUND_SHIPMENT,
    SEARCH_RECEIVAL_SHIPMENT,
    SEARCH_SELLER_INVENTORY
} from '@src/redux/actions/types.js';
import { normalizeObjectStringValuesToLowerCase } from '@src/component/utils/helper.js';
import '@src/assets/SearchShipment.scss';

const SearchShipment = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState(null);

    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(searchSellerInventoryColumns);
    const { items, category, itemsLoading } = useSelector((state) => state.warehouse.shipmentSearch)


    useEffect(() => {
        dispatch(getSellerInventory({ gt: 0 }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //memorized stable fetchData function since dispatch is changing.
    const handleSearchCategoryChange = useCallback((values) => {
        (() => {
            let category = typeof values.type === "string" ? values.type.toUpperCase() : values.type;
            switch (category) {
                case SEARCH_OUTBOUND_SHIPMENT:
                    dispatch(getShipment(values));
                    setColumns(searchShipmentColumns);
                    break;
                case SEARCH_RECEIVAL_SHIPMENT:
                    dispatch(getInventoryReceivedFromSearch(values))
                    setColumns(searchReceivedShipmentColumns);
                    break;
                case SEARCH_LOCATION_INVENTORY:
                    dispatch(getLocationInventory(values));
                    setColumns(searchLocationInventoryColumns);
                    break;
                case SEARCH_SELLER_INVENTORY:
                    dispatch(getSellerInventory(values));
                    setColumns(searchSellerInventoryColumns);
                    break;
                default:
                    console.warn('Unknow search category: ', category)
                    return;
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //rerender on redux searchCategory or new formValues changed.
    useEffect(() => {
        if (formValues) {
            handleSearchCategoryChange(formValues);
        }
    }, [category, formValues, handleSearchCategoryChange])

    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                //normalize values obj ignore values["type"]
                let normalizeValues = normalizeObjectStringValuesToLowerCase(values);
                setFormValues(normalizeValues);
                setVisible(false);
                console.log(`Form values:`, normalizeValues)
            })
            .catch(err => { console.error(err) })
    }

    const handleDownload = useCallback(() => {
        switch (category) {
            case SEARCH_OUTBOUND_SHIPMENT:
                dispatch(downloadShipment(formValues));
                break;
            case SEARCH_RECEIVAL_SHIPMENT:
                dispatch(downloadInventoryReceived(formValues));
                break;
            case SEARCH_LOCATION_INVENTORY:
                dispatch(downloadLocationInventory(formValues));
                break;
            default:
                return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, formValues])

    return (
        <Row>
            <Col id={`${category}`}>
                <FormTable
                    data={items}
                    columns={columns}
                    loading={itemsLoading}
                    tableSettings={{
                        ...defaultSettings,
                        title: () => (
                            <>
                                <DrawerSearch
                                    visible={visible}
                                    title="Search my Bean Brain"
                                    onSubmit={onSubmit}
                                    setVisible={setVisible}
                                    form={form}
                                />
                                <DownloadOutlined
                                    style={{
                                        alignSelf: "center",
                                        float: "right",
                                        lineHeight: "32px"
                                    }}
                                    onClick={handleDownload}
                                />
                            </>
                        )
                    }}
                />
            </Col>
        </Row>
    );

}

export default SearchShipment;