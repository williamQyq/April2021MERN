import {
    Menu,
    Button,
    Typography,
    Tooltip,
    Dropdown,
    message,
    Input,
    Tree
} from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    DownOutlined,
    PlusCircleOutlined,
    WindowsOutlined,
    ImportOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addItemSpec, getItemsOnlinePrice } from "reducers/actions/itemActions.js";
import { setTableState } from "reducers/actions/itemActions.js";
import { useState } from "react";

import { ContentHeader } from "component/utility/Layout.jsx";
import { storeType } from "./data.js";
import './Store.scss';

const { Text } = Typography;
const { Search } = Input;

const TypoLink = Typography.Link;
message.config = {
    maxCount: 3
}

export const defaultTableSettings = {
    showSorterTooltip: false,
    pagination: {
        defaultPageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        position: ['topRight', 'bottomRight']
    },
    size: "middle"
    // scroll: { y: "calc(100vh)" }

}


export const tableColumns = (storeName) => [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        searchable: true
        // sorter: (a, b) => a.name.length - b.name.length,
        // sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'UPC | SKU',
        dataIndex: 'upc',
        key: 'upc',
        width: '15%',
        searchable: true
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
const DropDownActions = (props) => {
    const { record, storeName } = props
    const dispatch = useDispatch();
    const prevTableState = useSelector(state => state.item.tableState)

    const { pathname } = useLocation();

    const actionHandler = {
        addItemSpecification: () => {
            console.log(`item spec added`, record._id);
            dispatch(addItemSpec(record, storeName));
        },

        saveActionHistory: () => {
            console.log(`clicked`, record._id)
            dispatch(setTableState({ ...prevTableState, store: storeName, clickedId: record._id }));
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


export const MostViewedSearchBox = (props) => {
    const { name, reduxAction } = props;
    const dispatch = useDispatch();
    const { mostViewedItemsLoading } = useSelector((state) => state.bestbuy)
    const [status, setStatus] = useState('')
    const onSearch = (value) => {
        // let isValid = /^\d{7}$/.test(value) //regex way check valid
        let output = value.split('').filter(ele => typeof (Number(ele)) === 'number');
        let isValid = output.length === 7
        if (isValid) {
            setStatus('')
            dispatch(reduxAction(value))
        } else {
            setStatus('error')
        }
    }

    return (
        <Search
            placeholder={name}
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            loading={mostViewedItemsLoading}
            status={status}
        />
    )
}

export const StoreOperationMenu = (props) => {
    const [selectedMenuKey, setSelectedMenuKey] = useState("upload");
    const { store } = props;

    const dispatch = useDispatch()
    const bestbuyOnlinePriceRetriving = useSelector((state) => state.bestbuy.onlinePriceLoading)
    const microsoftOnlinePriceRetriving = useSelector((state) => state.microsoft.onlinePriceLoading)

    //if puppeteer is retrieving online price on store return true else false
    const isOnlinePriceRetrieving = (store) => {
        switch (store) {
            case storeType.BESTBUY:
                return bestbuyOnlinePriceRetriving
            case storeType.MICROSOFT:
                return microsoftOnlinePriceRetriving
            default:
                return;
        }
    }
    const menuItems = [
        {
            key: 'retrieveOnlinePrice',
            icon: isOnlinePriceRetrieving(store) ? <LoadingOutlined /> : <ImportOutlined />,
            label: 'Click Me to Retrieve '
        }
    ]


    const onClickRetrieval = (key) => {
        setSelectedMenuKey(key)
        dispatch(getItemsOnlinePrice(store))
    }

    const treeData = [
        {
            title: <ContentHeader title={store} />,
            key: 'controller',
            children: [
                {
                    key: 'retrieve',
                    title: <>
                        <Menu
                            disabled={isOnlinePriceRetrieving(store)}
                            onClick={e => onClickRetrieval(e.key)}
                            selectedKeys={[selectedMenuKey]}
                            mode="horizontal"
                            items={menuItems}
                        />
                        {
                            // switchContent(selectedMenuKey)
                        }
                    </>
                }
            ]
        }
    ]

    return (
        <Tree
            showIcon
            blockNode
            defaultSelectedKeys={['controller']}
            switcherIcon={< DownOutlined />}
            treeData={treeData}
            selectable={false}
            style={{ "cursor": "auto" }}
        />

    );

}