import React from 'react';
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Typography, Card, Skeleton, Divider, Input, Form, InputNumber } from 'antd';
import { EditOutlined, EllipsisOutlined, LeftOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';

const layout = {
    labelCol: {
        span: 12,
    }
}
const validateMessages = {
    required: '${label} is required!',
    types: {
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
const cardStyle = {
    width: "300px",
    borderRadius: "4px",
    boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"

}

class OrderPanel extends React.Component {
    constructor(props) {
        super(props);

    }

    onFinish = (values) => {
        console.log(values);
    }
    render() {
        return (
            <Col flex="1 0 27.7777777778%" className="right-panel">
                {console.log(`render state name: ${JSON.stringify(this.props.name)}`)}

                <Card
                    style={cardStyle}
                    actions={[
                        <ShoppingCartOutlined key="shopping" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]}
                >

                    <Skeleton loading={this.props.loading} >
                        <Meta title="Place Order" />

                        <Divider />
                        <Form
                            {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}
                        >
                            <Form.Item
                                name={['order', 'product']}
                                label="Product"

                            >
                                <Input defaultValue={this.props.name} />
                            </Form.Item>

                            <Form.Item name={['Order', 'website']} label="Website">
                                <Input defaultValue={this.props.link} />
                            </Form.Item>

                            <Form.Item
                                name={['order', 'price']}
                                label="Price"
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                        min: 0,
                                        max: 9999,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name={['order', 'amount']}
                                label="Amount"
                                rules={[
                                    {
                                        required: true,
                                        type: 'number',
                                        min: 0,
                                        max: 9999,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>

                            <Form.Item name={['Order', 'introduction']} label="Introduction">
                                <Input.TextArea />
                            </Form.Item>
                        </Form>
                    </Skeleton>
                </Card>
            </Col>
        );

    }
}

OrderPanel.propTypes = {
    loading: PropTypes.bool.isRequired,
    name: PropTypes.object.isRequired,
    link: PropTypes.object.isRequired,

}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.itemBB.loading,
        name: state.itemBB.itemDetail.name,
        link: state.itemBB.itemDetail.link
    })
};

export default connect(mapStateToProps)(OrderPanel);