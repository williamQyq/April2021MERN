import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Store.scss';
import { SocketContext, socketType } from '@src/component/socket/socketContext.js';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    setTableState,
    addItemSpec,
    getItemsOnlinePrice,
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
} from '@redux-action/itemActions.js';
import {
    SearchOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined,
    WindowsOutlined,
    DownOutlined,
    ImportOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { ContentHeader } from '@src/component/utils/Layout';
import FormTable from '@src/component/utils/FormTable';
import { Tooltip, Button, Menu, Dropdown, Typography, Tree, } from 'antd';
import { BESTBUY, MICROSOFT, COSTCO, WALMART } from "@redux-action/types.js";

const Text = Typography.Text;
const TypoLink = Typography.Link;

const storeType = {
    BESTBUY,
    MICROSOFT,
    COSTCO,
    WALMART
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

const ActionMenu = (props) => {
    const { addItemSpecification } = props;

    const buttonSetting = {
        block: true,
        size: "large",
        type: "link"
    }

    const menuItems = [
        {
            label: (<Button disabled {...buttonSetting} icon={< PlusCircleOutlined />} />)
        },
        {
            label: (
                <Button {...buttonSetting} >
                    <Link to="item-detail" className="action-link" >
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
                    onClick={() => addItemSpecification()
                    }
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

const DropDownActions = (props) => {
    const { record, storeName } = props
    const dispatch = useDispatch();
    const prevTableState = useSelector(state => state.item.tableState, shallowEqual)

    const stableAddItemSpecification = useCallback(() => {
        dispatch(addItemSpec(record, storeName));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record, storeName])

    const stableSaveActionHistory = useCallback(() => {
        dispatch(setTableState({ ...prevTableState, store: storeName, clickedId: record._id }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevTableState, record, storeName])

    return (
        <Dropdown
            trigger={["click"]}
            menu={() => ActionMenu({ addItemSpecification: stableAddItemSpecification })}
            placement="bottom"
        >
            <TypoLink onClick={stableSaveActionHistory}>
                More Actions < DownOutlined />
            </TypoLink>
        </Dropdown>
    );

}


const tableColumns = (storeName) => [
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
                    <Text type="success" > $ {text} </Text> : <Text type="danger">$ {text}</Text >
            )
        }
    },
    {
        title:
            <Tooltip
                placement="topLeft"
                title='Click to sort on price diff'
            >
                Current Price
            </Tooltip>,
        dataIndex: 'currentPrice',
        key: 'currentPrice',
        width: '10%',
        // defaultSortOrder: tableState.currentPrice,
        sorter: (a, b) => a.currentPrice - b.currentPrice,
        render: (text, record) => (
            record.isCurrentPriceLower ?
                <Text type="success" > $ {text} </Text>
                :
                <Text type="danger" > $ {text} </Text>
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
        render: (_, record) => <DropDownActions record={record} storeName={storeName} />
    }

]

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
            title: "open more options",
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

// import BackTopHelper from 'component/utility/BackTop';
class StoreTable extends React.Component {
    static contextType = SocketContext
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };
        this.socketType = socketType;
    }

    componentDidMount() {
    }

    render() {
        const { items, storeName, loading, tableState } = this.props
        const columns = tableColumns(storeName)
        return (
            <>
                <ContentHeader title={storeName} />
                <StoreOperationMenu store={storeName} />
                <FormTable
                    loading={loading}
                    tableSettings={{ ...defaultTableSettings, expandable: null, tableState: tableState }}
                    columns={columns}
                    data={items}
                />
            </>
        )
    }
}
const mapStateToProps = (state) => ({
    tableState: state.item.tableState,

})

export default connect(mapStateToProps, {
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
})(StoreTable);