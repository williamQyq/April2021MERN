import React from 'react';
import 'antd/dist/antd.css';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const data = [];
for (let i = 0; i < 5; i++) {
    data.push({
        key: i,
        asin: 'B09G2QZP71',
        sku: '196068763954-16051200H00P-AFBA-4PB5-480',
        fulfillmentChannel: 'MERCHANT',
        amzRegularPrice: 807.99,
        profitSettlementRate: 0.15,
        settlementPrice: 900,
        status: 'complete'
    })
}


const NestedTable = () => {
    const columns = [
        { title: 'Asin', dataIndex: 'asin', key: 'asin' },
        { title: 'Sku', dataIndex: 'sku', key: 'sku' },
        {
            title: 'Fulfillment Channel',
            dataIndex: 'fulfillmentChannel',
            key: 'fulfillmentChannel',
            filters: [
                {
                    text: 'FBA',
                    value: 'AMAZON',
                },
                {
                    text: 'Merchant',
                    value: 'MERCHANT',
                },
            ],
        },
        { title: 'Amazon Regular Price', dataIndex: 'amzRegularPrice', key: 'amzRegularPrice' },
        { title: 'Settlement Rate', dataIndex: 'profitSettlementRate', key: 'profitSettlementRate' },
        { title: 'Settlement Price', dataIndex: 'settlementPrice', key: 'settlementPrice' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'state',
            render: () => (
                <span>
                    <Badge status="success" />
                    Finished
                </span>
            )
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
                <Space size="middle">
                    <a>Edit Profit Rate</a>
                    <Dropdown overlay={menu}>
                        <a>
                            More <DownOutlined />
                        </a>
                    </Dropdown>
                </Space>
            ),
        },
    ]
    const menu = (
        <Menu>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
        </Menu>
    )

    return <Table columns={columns} dataSource={data} pagination={false} />
};

export default NestedTable;