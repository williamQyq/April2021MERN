import React from 'react';
import './Store.scss';
import { SocketContext, socketType } from '@src/component/socket/SocketProvider';
import { connect, useDispatch, useSelector, ConnectedProps } from 'react-redux';
import {
    saveUserTableSettings,
    // addItemSpec,
    handlePriceCrawlFinished,
    handlePriceCrawlError,
    signalPriceCrawler,
    getItemDetail
} from '@redux-action/deal.action';
import { AppDispatch, DealsDataSourceType } from '@src/redux/interface';
import { BESTBUY, MICROSOFT, COSTCO, WALMART } from "@redux-action/types.js";
import { RootState } from '@src/redux/store/store';
import {
    ImportOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { ContentHeader } from '@src/component/utils/Layout';
import FormTable from '@src/component/utils/FormTable';
import { Tooltip, Typography, Tree, } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { BaseType } from 'antd/es/typography/Base';
import { DataNode } from 'antd/es/tree';
import { CiMenuKebab } from 'react-icons/ci';
import { Key } from '@ant-design/pro-components';
import WithNavigate from '@src/component/auth/WithNavigate';
import { NavigateFunction } from 'react-router-dom';

const Text = Typography.Text;

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

// const ActionMenu = (props) => {
//     const { addItemSpecification } = props;

//     const buttonSetting = {
//         block: true,
//         size: "large",
//         type: "link"
//     }

//     const menuItems = [
//         {
//             label: (<Button disabled {...buttonSetting} icon={< PlusCircleOutlined />} />)
//         },
//         {
//             label: (
//                 <Button {...buttonSetting} >
//                     <Link to="item-detail" className="action-link" >
//                         <SearchOutlined />
//                         Detail
//                     </Link>
//                 </Button>
//             )
//         },
//         {
//             label: (
//                 <Button disabled {...buttonSetting}>
//                     <ShoppingCartOutlined />
//                     Cart
//                 </Button>
//             )
//         },
//         {
//             label: (
//                 <Button
//                     {...buttonSetting}
//                     onClick={() => addItemSpecification()
//                     }
//                 >
//                     <WindowsOutlined />
//                     Spec
//                 </Button>
//             )
//         }
//     ]

//     return (
//         <Menu items={menuItems} />
//     );
// }

// const DropDownActions = (props) => {
//     const { record, storeName } = props
//     const dispatch = useDispatch();
//     const prevTableState = useSelector(state => state.item.tableState, shallowEqual)

//     const stableAddItemSpecification = useCallback(() => {
//         dispatch(addItemSpec(record, storeName));

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [record, storeName])

//     const stableSaveActionHistory = useCallback(() => {
//         dispatch(saveUserTableSettings({ ...prevTableState, store: storeName, clickedId: record._id }));

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [prevTableState, record, storeName])

//     return (
//         <Dropdown
//             trigger={["click"]}
//             menu={() => ActionMenu({ addItemSpecification: stableAddItemSpecification })}
//             placement="bottom"
//         >
//             <TypoLink onClick={stableSaveActionHistory}>
//                 More Actions < DownOutlined />
//             </TypoLink>
//         </Dropdown>
//     );

// }

export interface CustomColumnProps<T> extends ColumnProps<T> {
    searchable?: boolean;
}

const tableColumns: CustomColumnProps<DealsDataSourceType>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        searchable: true
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
        sorter: (a: DealsDataSourceType, b: DealsDataSourceType) => a.priceDiff - b.priceDiff,
        render: (priceDiff: number, record: DealsDataSourceType) => {
            let priceDifferece: number = Math.round(priceDiff);
            let textTypeProps: BaseType = record.isCurrentPriceLower ? "success" : "danger";
            return (
                <Text type={textTypeProps} > $ {priceDifferece} </Text>
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
        sorter: (a, b) => Number(new Date(a.captureDate)) - Number(new Date(b.captureDate)),
        sortDirections: ['descend', 'ascend', 'descend'],
    }

]
interface ICrawlerControlDropdownProps {
    storeName: string;
}
export const CrawlerControlDropdown: React.FC<ICrawlerControlDropdownProps> = ({ storeName }) => {

    const dispatch = useDispatch<AppDispatch>()
    const bestbuyOnlinePriceRetriving = useSelector((state: RootState) => state.bestbuy.onlinePriceLoading)
    const microsoftOnlinePriceRetriving = useSelector((state: RootState) => state.microsoft.onlinePriceLoading)

    //if puppeteer is retrieving online price on store return true else false
    let isRetrievingDeals = ((selectedStore: string): boolean => {
        switch (selectedStore) {
            case storeType.BESTBUY:
                return bestbuyOnlinePriceRetriving
            case storeType.MICROSOFT:
                return microsoftOnlinePriceRetriving
            default:
                return false;
        }
    })(storeName);

    const handleSelectedMenuAction = (keys: Key[]) => {
        switch (keys[0]) {
            case "crawl":
                dispatch(signalPriceCrawler(storeName));
                break;
        }
    }

    const treeData: DataNode[] = [
        {
            title: "Bot Options",
            key: 'options',
            children: [
                {
                    key: 'crawl',
                    disabled: isRetrievingDeals ? isRetrievingDeals : false,
                    icon: () => (isRetrievingDeals ? <LoadingOutlined /> : <ImportOutlined />),
                    title: "Initiate Bot",
                }
            ]
        }
    ]

    return (
        <Tree
            showIcon
            defaultExpandAll
            defaultSelectedKeys={['options']}
            switcherIcon={<CiMenuKebab />}
            treeData={treeData}
            onSelect={(selectedKeys) => handleSelectedMenuAction(selectedKeys)}
        />

    );

}
export interface DealsDataTableProps {
    storeName: string;
    items: unknown[];
    loading: boolean;
}

interface IProps extends PropsFromRedux, DealsDataTableProps {
    navigate: NavigateFunction;
}
interface IState {
    searchText: string;
    searchedRowId: string;
    searchedColumn: string;
}
// import BackTopHelper from 'component/utility/BackTop';
class DealsTable extends React.Component<IProps, IState> {
    static contextType = SocketContext;
    static socketType = socketType;
    declare context: React.ContextType<typeof SocketContext>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };
    }

    componentDidMount() {

    }

    handleRowClick = (record: DealsDataSourceType) => {
        console.log(record);
        console.log(this.props.storeName)
        let dealDetailRoute = `/app/deal-alert/${this.props.storeName.toLowerCase()}-list/item-detail`;
        this.props.navigate(dealDetailRoute);
    }

    render() {
        const { items, storeName, loading, userTableSettings } = this.props
        return (
            <>
                <ContentHeader title={storeName} />
                <CrawlerControlDropdown storeName={storeName} />
                <FormTable
                    loading={loading}
                    tableSettings={{ ...defaultTableSettings, expandable: null, userTableSettings }}
                    columns={tableColumns}
                    data={items}
                    handleRowClick={this.handleRowClick}

                />
            </>
        )
    }
}
const mapStateToProps = (state: RootState) => ({
    userTableSettings: state.item.tableState,
})

const connector = connect(mapStateToProps, {
    handlePriceCrawlFinished,
    handlePriceCrawlError,
    saveUserTableSettings,
    signalPriceCrawler,
    getItemDetail
})

type PropsFromRedux = ConnectedProps<typeof connector>;
export default WithNavigate(connector(DealsTable));