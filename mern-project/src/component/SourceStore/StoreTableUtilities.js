import {
    Menu,
    Button,
    Typography,
    Tooltip,
    Dropdown,
    Row,
    Col,
    message,
    Alert,
    Divider,
} from "antd";
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
const TypoLink = Typography.Link;
message.config = {
    maxCount: 3
}


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

export const defaultTableSettings = {
    showSorterTooltip: false,
    pagination: {
        defaultPageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        position: ['topRight', 'bottomRight']
    },
    // scroll: { y: "calc(100vh - 335px)" } //slow performance issue

}


export const TableColumns = (getColumnSearchProps, storeName) => {


    return (
        [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                ...getColumnSearchProps(['name']),
                // sorter: (a, b) => a.name.length - b.name.length,
                // sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'UPC | SKU',
                dataIndex: 'upc',
                key: 'upc',
                width: '15%',
                ...getColumnSearchProps(['upc', 'sku']),
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
                render: (_, record) => (
                    <DropDownActions record={record} storeName={storeName} />
                ),
            }

        ]
    )

}

const DropDownActions = (props) => {
    const { record, storeName } = props
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const actionHandler = {
        addItemSpecification: () => {
            console.log(`item spec added`, record._id);
            dispatch(addItemSpec(record, storeName));
        },

        saveActionHistory: () => {
            console.log(`clicked`, record._id)
            dispatch(setTableState(storeName, record._id));
        },
        pathname
    }

    return (
        <Dropdown
            trigger={["click"]}
            overlay={ActionMenu({ ...actionHandler })}
            placement="bottom"
        >
            <TypoLink onClick={() => actionHandler.saveActionHistory()}>More Actions <DownOutlined /></TypoLink>
        </Dropdown>
    );

}
const ActionMenu = (props) => {
    const { addItemSpecification, pathname } = props

    const buttonSetting = {
        block: true,
        size: "large",
        type: "link"
    }

    const menuItems = [
        {
            label: (<Button disabled {...buttonSetting} icon={<PlusCircleOutlined />} />)
        },
        {
            label: (
                <Button {...buttonSetting}>
                    <Link to={`${pathname}/item-detail`} className="action-link">
                        <SearchOutlined />
                        Detail
                    </Link>
                </Button>
            )
        },
        {
            label: (
                <Button disabled {...buttonSetting}>
                    <ShoppingCartOutlined />
                    Cart
                </Button>
            )
        },
        {
            label: (
                <Button
                    {...buttonSetting}
                    onClick={() => addItemSpecification()}
                >
                    <WindowsOutlined />
                    Spec
                </Button>
            )
        }
    ]

    return (
        <Menu items={menuItems} />
    );
}

export const ContentHeader = ({ title }) => (
    <>
        <Row gutter={16} style={{ alignItems: 'center' }}>
            <Col>
                <Title level={4}>{title}</Title>
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
        <Divider />
    </>
);

export const SubContentHeader = ({ title }) => {
    return (
        <>
            <Row gutter={16} style={{ alignItems: 'center' }}>
                <Col>
                    <Title level={4}>{title}</Title>
                </Col>
                {/* <Col>
                    <Button type="primary" disabled={isLoading} loading={isLoading}>
                        Retrieve Now
                    </Button>
                </Col> */}
            </Row>
            <Divider />
        </>
    );
}

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
                afterClose={() => dispatch(clearErrors)}
            />
        ) : null
}