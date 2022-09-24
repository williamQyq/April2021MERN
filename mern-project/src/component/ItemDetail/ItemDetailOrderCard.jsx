import React from 'react';
import 'antd/dist/antd.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Skeleton, Divider, Input, Form, InputNumber } from 'antd';
import { EditOutlined, EllipsisOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const layout = {
    labelCol: {
        span: 12,
    }
}

const cardStyle = {
    width: "300px",
    borderRadius: "4px",
    boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.8)"

}

class OrderPanel extends React.Component {

    onFinish = (values) => {
        console.log(values);
    }
    render() {
        const { name, link, loading } = this.props;
        return (
            <Card
                style={cardStyle}
                actions={[
                    <ShoppingCartOutlined key="shopping" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Skeleton loading={loading} >
                    <Card.Meta title="Place Order" />
                    <Divider />
                    <Form
                        {...layout} name="nest-messages"
                        onFinish={this.onFinish}
                        initialValues={{
                            product: name,
                            website: link,
                        }}
                    >
                        <Form.Item name='product' label="Product">
                            <Input />
                        </Form.Item>

                        <Form.Item name='website' label='Website'>
                            <Input />
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
        );

    }
}

OrderPanel.propTypes = {
    loading: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,

}

const mapStateToProps = (state) => {
    return ({
        loading: state.item.loading,
        name: state.item.itemDetail.name,
        link: state.item.itemDetail.link
    })
};

export default connect(mapStateToProps)(OrderPanel);