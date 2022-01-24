import { Menu, Button, Typography, Tooltip, Space, Dropdown, Row, Col } from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    DownOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Text, Title } = Typography;

export const locateSearchedItem = (items, searchId) => {
    if (searchId) {
        for (let index = 0; index < items.length; index++)
            if (items[index]._id === searchId) {
                return ({
                    index: index,
                    _id: items[index]._id,
                })
            }
    }
    return ({
        index: 0,
        _id: ""
    })
}

export const scrollToTableRow = (document, row) => {
    const tableRowHight = 75.31;
    let v = document.getElementsByClassName("ant-table-body")[0];
    v.scrollTop = tableRowHight * (row - 3);
}

export const tableColumns = (getColumnSearchProps, handleActionClick, storeName) => {
    //create columns data based on dataIndex
    return (
        [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                ...getColumnSearchProps('name'),
                // sorter: (a, b) => a.name.length - b.name.length,
                // sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'UPC',
                dataIndex: 'upc',
                key: 'upc',
                width: '15%',
                ...getColumnSearchProps('upc'),
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                key: 'quantity',
                width: '10%',
                sorter: (a, b) => a.qty - b.qty,
            },
            {
                title: 'Price Diff',
                dataIndex: 'priceDiff',
                key: 'priceDiff',
                width: '10%',
                // defaultSortOrder: tableState.priceDiff,
                sorter: (a, b) => a.priceDiff - b.priceDiff,
                render: (text, record) => {
                    text = Math.round(parseFloat(text));
                    return (
                        record.isCurrentPriceLower ?
                            <Text type="success">$ {text}</Text> : <Text type="danger">$ {text}</Text>
                    )
                }
            },
            {
                title: <Tooltip
                    placement="topLeft"
                    title='Click to sort on price diff'>
                    Current Price
                </Tooltip>,
                dataIndex: 'currentPrice',
                key: 'currentPrice',
                width: '10%',
                // defaultSortOrder: tableState.currentPrice,
                sorter: (a, b) => a.currentPrice - b.currentPrice,
                render: (text, record) => (
                    record.isCurrentPriceLower ? <Text type="success">$ {text}</Text>
                        : <Text type="danger">$ {text}</Text>
                )
            },
            {
                title: 'Capture Date',
                dataIndex: 'captureDate',
                key: 'captureDate',
                width: '10%',
                // defaultSortOrder: tableState.captureDate,
                sorter: (a, b) => new Date(a.captureDate) - new Date(b.captureDate),
                sortDirections: ['descend', 'ascend', 'descend'],
            },
            {
                title: 'Action',
                key: 'action',
                width: '10%',
                render: (text, record) => (
                    <Space size="middle">
                        <Dropdown overlay={ActionMenu(record, handleActionClick, storeName)} placement="bottomCenter">
                            <a href="# " className="ant-dropdown-link" >
                                More Actions <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                ),
            },

        ]
    )

}

const ActionMenu = (record, handleActionClick, storeName) => {
    const location = useLocation()
    const path = location.pathname;
    return (
        <Menu>
            <Menu.Item key="AddToWatchList">
                <Button disabled className="menu-btn">
                    <PlusCircleOutlined />
                </Button>
            </Menu.Item>
            <Menu.Item key="GetItemDetail">

                <Button className="menu-btn" onClick={() => handleActionClick(storeName, record._id)}>
                    <Link to={`${path}/item-detail`}>
                        <SearchOutlined />
                    </Link>
                </Button>

            </Menu.Item>
            <Menu.Item key="AddToCart">
                <Button disabled className="menu-btn">
                    <ShoppingCartOutlined />
                </Button>
            </Menu.Item>
        </Menu >
    );
}

export const StoreHeader = ({ storeName, isLoading }) => (
    <Row gutter={16} style={{ alignItems: 'center' }}>
        <Col>
            <Title level={4}>{storeName}</Title>
        </Col>
        <Col>
            <Button type="primary" disabled={isLoading} loading={isLoading}>
                Retrieve Now
            </Button>
        </Col>
    </Row>
);