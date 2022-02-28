import { Menu, Button, Typography, Tooltip, Space, Dropdown, Row, Col, message, Alert } from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    DownOutlined,
    PlusCircleOutlined,
    WindowsOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addItemSpec } from "reducers/actions/itemActions";
import { clearErrors } from "reducers/actions/errorActions";
import { setTableState } from "reducers/actions/itemActions";

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

export const tableColumns = (getColumnSearchProps, storeName) => {
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
                        <Dropdown
                            trigger={["click"]}
                            overlay={
                                ActionMenu({ record, storeName })
                            }
                            placement="bottomCenter">
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

message.config = {
    maxCount: 3
}

const ActionMenu = (props) => {

    const { record, storeName } = props
    const location = useLocation();
    const dispatch = useDispatch()

    const path = location.pathname;

    const addItemSpecification = () => {
        dispatch(addItemSpec(record, storeName));
    }

    const saveActionHistory = () => {
        console.log(`clicked`, record._id)
        dispatch(setTableState(storeName, record._id));
    };

    const buttonSetting = {
        block: true,
        size: "large",
        type: "link"
    }
    return (
        <Menu>
            <Menu.Item key="AddToWatchList">
                <Button disabled {...buttonSetting}>
                    <PlusCircleOutlined />

                </Button>
            </Menu.Item>
            <Menu.Item key="GetItemDetail">

                <Button {...buttonSetting} onClick={saveActionHistory}>
                    <Link to={`${path}/item-detail`} className="action-link">
                        <SearchOutlined />
                        Detail
                    </Link>
                </Button>

            </Menu.Item>
            <Menu.Item key="AddToCart">
                <Button disabled {...buttonSetting}>
                    <ShoppingCartOutlined />
                    Cart
                </Button>
            </Menu.Item>
            <Menu.Item key="GetOnlineSpec">
                <Button {...buttonSetting} onClick={() => {
                    saveActionHistory();
                    addItemSpecification();
                }}>
                    <WindowsOutlined />
                    Spec
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
            <ErrorAlert />
        </Col>
        {/* <Col>
            <Button type="primary" disabled={isLoading} loading={isLoading}>
                Retrieve Now
            </Button>
        </Col> */}
    </Row>
);

export const ErrorAlert = () => {
    const { status, msg } = useSelector((state) =>
        state.error
    );
    const dispatch = useDispatch();

    return status ?
        (
            <Alert
                message={msg}
                type={status}
                showIcon
                banner
                closable
                afterClose={() => { dispatch(clearErrors()); }}
            />
        ) : null
}