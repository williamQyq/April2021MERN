
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';

const { Option } = Select;

const DrawerSearch = (props) => {
    const { title, onSubmit, setVisible, visible, form } = props;
    const [searchCategory, setCategory] = useState('');
    const [shipmentOptionSelectable, setShipmentOption] = useState(true);
    const [inventoryReceiveOptionSelectable, setInventoryReceiveOption] = useState(true);
    const [inventoryLocationOptionSelectable, setInventoryLocationOption] = useState(true);

    useEffect(() => {
        setShipmentOption(searchCategory === 'outBoundShipment' ? true : false);
        setInventoryReceiveOption(searchCategory === 'inBoundReceived' ? true : false);
        setInventoryLocationOption(searchCategory === 'locationInventory' ? true : false);
    }, [searchCategory])

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleCategoryChange = (category) => {
        setCategory(category);
    }

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<SearchOutlined />}>
                {title}
            </Button>
            <Drawer
                title="Search Shipment"
                width={720}
                onClose={onClose}
                visible={visible}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={onSubmit} type="primary" >
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark={false} form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="OrderId"
                                label="OrderId"
                            >
                                <Input disabled={!shipmentOptionSelectable} placeholder="Please enter OrderId" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="trackingId"
                                label="TrackingId"
                            >
                                <Input disabled={!(shipmentOptionSelectable || inventoryReceiveOptionSelectable)} placeholder="Please enter TrackingId" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="orgNm"
                                label="orgNm"
                            >
                                <Select
                                    disabled={
                                        !(
                                            shipmentOptionSelectable ||
                                            inventoryReceiveOptionSelectable
                                        )
                                    }
                                    placeholder="Please select an organization">
                                    <Option value="M">M</Option>
                                    <Option value="R">R</Option>
                                    <Option value="X">X</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose the type',
                                    },
                                ]}
                            >
                                <Select onSelect={handleCategoryChange} placeholder="Please choose the type">
                                    <Option value="outBoundShipment">OutBound Shipment</Option>
                                    <Option value="inBoundReceived">InBound Received</Option>
                                    <Option value="locationInventory">Location Inventory</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="upc"
                                label="UPC"
                            >
                                <Input
                                    disabled={
                                        !(
                                            shipmentOptionSelectable ||
                                            inventoryReceiveOptionSelectable ||
                                            inventoryLocationOptionSelectable
                                        )
                                    }
                                    placeholder="Please enter UPC" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="sn"
                                label="SN"
                            >
                                <Input disabled={!shipmentOptionSelectable} placeholder="Please enter SN" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="dateTime"
                                label="DateTime"
                            >
                                <DatePicker.RangePicker
                                    style={{
                                        width: '100%',
                                    }}
                                    getPopupContainer={(trigger) => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
}

export default DrawerSearch;