
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import DrawerSearch from 'component/utility/DrawerSearch.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import {
    defaultSettings,
    searchReceivedShipmentColumns,
    searchShipmentColumns,
    searchLocationInventoryColumns,
    searchSellerInventoryColumns
} from 'component/Warehouse/utilities.js';
import { downloadShipment, getShipment } from 'reducers/actions/outboundActions.js';
import {
    downloadInventoryReceived,
    downloadLocationInventory,
    getInventoryReceivedFromSearch,
    getLocationInventory,
    getSellerInventory
} from 'reducers/actions/inboundActions';
import {
    SEARCH_LOCATION_INVENTORY,
    SEARCH_OUTBOUND_SHIPMENT,
    SEARCH_RECEIVAL_SHIPMENT,
    SEARCH_SELLER_INVENTORY
} from 'reducers/actions/types.js';
import { useCallback } from 'react';
import { normalizeObjectStringValuesToLowerCase } from 'component/utility/helper.js';

const SearchShipment = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [columns, setColumns] = useState(searchSellerInventoryColumns);
    const [style, setStyle] = useState({
        col1: { xl: 16, xxl: 16 },
        col2: { xl: 2, xxl: 4 }
    });
    const { items, category, itemsLoading } = useSelector((state) => state.warehouse.shipmentSearch)
    const [formValues, setFormValues] = useState(null);

    //memorized stable fetchData function since dispatch is changing.
    const fetchDataOnSearchCategoryChange = useCallback((type, values) => {
        const handleDataOnSearchCategoryChange = (category, values) => {
            category = typeof category === "string" ? category.toUpperCase() : category;
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
                case SEARCH_SELLER_INVENTORY:
                    dispatch(getSellerInventory(values));
                    break;
                default:
                    return;
            }
        }
        handleDataOnSearchCategoryChange(type, values);
    }, [dispatch])

    //fetch wms data on search with formValues changed
    useEffect(() => {
        if (formValues) {
            handleColumnsOnSearchCategoryChange(formValues.type)
            fetchDataOnSearchCategoryChange(formValues.type, formValues);   //fetch corresponding data
            setVisible(false)   //set drawer invisible
        }
    }, [formValues, fetchDataOnSearchCategoryChange])

    //prevent refetch wms shipment if has info
    useEffect(() => {
        if (!category) {
            dispatch(getSellerInventory({ gt: 0 })); //dispatch default get seller inventory when did mount
        } else {
            handleColumnsOnSearchCategoryChange(category);
        }
    }, [category, dispatch])

    const handleColumnsOnSearchCategoryChange = (category) => {
        switch (category) {
            case SEARCH_OUTBOUND_SHIPMENT:
                setColumns(searchShipmentColumns);
                setStyle({
                    col2: { xs: 2, xl: 2, xxl: 0 },
                    col1: { xs: 18, xl: 18, xxl: 24 },
                })
                break;
            case SEARCH_RECEIVAL_SHIPMENT:
                setColumns(searchReceivedShipmentColumns);
                setStyle({
                    col2: { xs: 2, xl: 2, xxl: 0 },
                    col1: { xs: 18, xl: 18, xxl: 24 },
                })
                break;
            case SEARCH_LOCATION_INVENTORY:
                setColumns(searchLocationInventoryColumns);
                setStyle({
                    ...style,
                    col1: { xs: 16, xl: 16, xxl: 16 },
                })
                break;
            case SEARCH_SELLER_INVENTORY:
                setColumns(searchSellerInventoryColumns);
                setStyle({
                    ...style,
                    col1: { xs: 16, xl: 16, xxl: 16 },
                })
                break;
            default:
                return;
        }
    }

    const onSubmit = () => {
        form.validateFields()
            .then((values) => {
                //normalize values obj ignore values["type"]
                values = normalizeObjectStringValuesToLowerCase(values);
                setFormValues(values);
                console.log(`Form values:`, values)
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
        <Row>
            <Col xs={style.col2.xs} xl={style.col2.xl} xxl={style.col2.xxl}></Col>
            <Col xs={style.col1.xs} xl={style.col1.xl} xxl={style.col1.xxl}>
                <FormTable
                    data={items}
                    columns={columns}
                    loading={itemsLoading}
                    tableSettings={{
                        ...defaultSettings,
                        title: () =>
                            <>
                                <DrawerSearch
                                    visible={visible}
                                    title="Search my Bean Brain"
                                    onSubmit={onSubmit}
                                    setVisible={setVisible}
                                    form={form}
                                />
                                <DownloadOutlined onClick={handleDownload} style={{ alignSelf: "center", float: "right", lineHeight: "32px" }} />
                            </>
                    }}
                />
            </Col>
            <Col xs={style.col1.xs} xl={style.col2.xl} xxl={style.col2.xxl}></Col>
        </Row>
    );

}

export default SearchShipment;