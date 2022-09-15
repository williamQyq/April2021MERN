import moment from 'moment';
import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { SEARCH_LOCATION_INVENTORY, SEARCH_OUTBOUND_SHIPMENT, SEARCH_RECEIVAL_SHIPMENT } from 'reducers/actions/types.js';

const { Option } = Select;

const DrawerSearch = (props) => {
    const { title, onSubmit, setVisible, visible, form } = props;
    const [searchCategory, setCategory] = useState('');
    const [shipmentOptionSelectable, setShipmentOption] = useState(true);
    const [inventoryReceiveOptionSelectable, setInventoryReceiveOption] = useState(true);
    const [inventoryLocationOptionSelectable, setInventoryLocationOption] = useState(true);

    const [hackValue, setHackValue] = useState(null);
    const [value, setValue] = useState(null);
    const [dates, setDates] = useState(null);

    const dateFormat = 'YYYY-MM-DD';

    useEffect(() => {
        setShipmentOption(searchCategory === SEARCH_OUTBOUND_SHIPMENT ? true : false);
        setInventoryReceiveOption(searchCategory === SEARCH_RECEIVAL_SHIPMENT ? true : false);
        setInventoryLocationOption(searchCategory === SEARCH_LOCATION_INVENTORY ? true : false);

        setValue([getOffDate(-90), getOffDate(0)])
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

    const getOffDate = (offDays = 0) => {
        let d = new Date();
        let day = d.getDate();
        d.setDate(day + offDays);

        return moment(d, dateFormat);
    }

    const disabledDate = (current) => {
        if (!dates) {
            return false;
        }

        const tooLate = dates[0] && current.diff(dates[0], 'days') > 90;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 90;
        return !!tooEarly || !!tooLate;
    };

    const onOpenChange = (open) => {
        if (open) {
            setHackValue([null, null]);
            setDates([null, null]);
            form.setFieldsValue({ dateTime: [null, null] });    //clear datePicker values

        } else {
            setHackValue(null);
        }
    };

    const handleOrgNmInputChange = (value) => {
        form.setFieldsValue({ orgNm: value.toUpperCase() })
    }

    let isOrderIdInputEditable = !shipmentOptionSelectable;
    let isTrackingIdInputEditable = !(shipmentOptionSelectable || inventoryReceiveOptionSelectable);
    let isOrgNmInputEditable = !(shipmentOptionSelectable || inventoryReceiveOptionSelectable);
    let isUpcInputEditable = !(
        shipmentOptionSelectable ||
        inventoryReceiveOptionSelectable ||
        inventoryLocationOptionSelectable
    );
    let isSnInputEditable = !shipmentOptionSelectable;


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
                <Form layout="vertical" hideRequiredMark={false} form={form} initialValues={{ dateTime: value }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="OrderId"
                                label="OrderId"
                            >
                                <Input disabled={isOrderIdInputEditable} placeholder="Please enter OrderId" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="trackingId"
                                label="TrackingId"
                            >
                                <Input disabled={isTrackingIdInputEditable} placeholder="Please enter TrackingId" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="orgNm"
                                label="orgNm"
                            >
                                <AutoComplete
                                    showSearch
                                    autoClearSearchValue
                                    disabled={isOrgNmInputEditable}
                                    placeholder="Please select an organization"
                                    onChange={(value) => { handleOrgNmInputChange(value) }}
                                >
                                    <AutoComplete.Option value="M">M</AutoComplete.Option>
                                    <AutoComplete.Option value="R">R</AutoComplete.Option>
                                    <AutoComplete.Option value="C">C</AutoComplete.Option>
                                    <AutoComplete.Option value="X">X</AutoComplete.Option>
                                </AutoComplete>
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
                                    <Option value={SEARCH_OUTBOUND_SHIPMENT}>OutBound Shipment</Option>
                                    <Option value={SEARCH_RECEIVAL_SHIPMENT}>InBound Receival</Option>
                                    <Option value={SEARCH_LOCATION_INVENTORY}>Location Inventory</Option>
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
                                    disabled={isUpcInputEditable}
                                    placeholder="Please enter UPC" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="sn"
                                label="SN"
                            >
                                <Input disabled={isSnInputEditable} placeholder="Please enter SN" />
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
                                    value={hackValue || value}
                                    disabledDate={disabledDate}
                                    onCalendarChange={(val) => setDates(val)}
                                    onChange={(val) => setValue(val)}
                                    onOpenChange={onOpenChange}
                                    // defaultValue={value}
                                    format={dateFormat}
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