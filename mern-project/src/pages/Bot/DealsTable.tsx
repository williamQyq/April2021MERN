import React from 'react';
import './Store.scss';
//redux
import { connect, useDispatch, useSelector, ConnectedProps } from 'react-redux';
import {
    saveUserTableSettings,
    // addItemSpec,
    handlePriceCrawlFinished,
    handlePriceCrawlError,
    signalPriceCrawler,
} from '@redux-action/deal.action';
import { AppDispatch, DealsDataSourceType } from '@src/redux/interface';
import { BESTBUY, MICROSOFT, COSTCO, WALMART } from "@redux-action/types.js";
import { RootState } from '@src/redux/store/store';
//Antd 
import {
    ImportOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { Tooltip, Typography, Tree, } from 'antd';
import { ColumnGroupType, ColumnType, TableProps } from 'antd/es/table';
import { BaseType } from 'antd/es/typography/Base';
import { DataNode } from 'antd/es/tree';
import { Key } from '@ant-design/pro-components';
import { CiMenuKebab } from 'react-icons/ci';

import { ContentHeader } from '@src/component/utils/Layout';
import WithNavigate, { WithNavigateProps } from '@src/component/auth/WithNavigate';
import { SocketContext } from '@src/component/socket/SocketProvider';
import FormTable, { ColumnTypeWithSearchable } from '@src/component/utils/FormTable';

const Text = Typography.Text;

const storeType = {
    BESTBUY,
    MICROSOFT,
    COSTCO,
    WALMART
}

export const defaultTableSettings: TableProps<any> = {
    showSorterTooltip: false,
    pagination: {
        defaultPageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        position: ['topRight', 'bottomRight']
    },
    size: "middle",
    expandable: undefined
    // scroll: { y: "calc(100vh)" }

}

const tableColumns: ColumnTypeWithSearchable<DealsDataSourceType>[] = [
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
    loading: boolean;
}
export const CrawlerControlDropdown: React.FC<ICrawlerControlDropdownProps> = ({ storeName, loading }) => {

    const dispatch = useDispatch<AppDispatch>()

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
                    disabled: loading,
                    icon: () => (loading ? <LoadingOutlined /> : <ImportOutlined />),
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
    items: readonly Record<string, string>[];
    loading: boolean;
    onlinePriceLoading: boolean;
}

interface IProps extends PropsFromRedux, DealsDataTableProps, WithNavigateProps { };
interface IState {
    searchText: string;
    searchedRowId: string;
    searchedColumn: string;
}
// import BackTopHelper from 'component/utility/BackTop';
class DealsTable extends React.Component<IProps, IState> {
    static contextType = SocketContext;
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

    handleRowClick = <T extends Record<string, string>>(record: T) => {
        const { storeName, navigate, location } = this.props;
        if (navigate) navigate(`detail/store/${storeName}/id/${record._id}/sku/${record.sku}`);
    }

    render() {
        const {
            items,
            storeName,
            loading,
            onlinePriceLoading,
            userTableSettings
        } = this.props;
        return (
            <>
                <ContentHeader title={storeName} />
                <CrawlerControlDropdown loading={onlinePriceLoading} storeName={storeName} />
                <FormTable
                    {...defaultTableSettings}
                    loading={loading}
                    columns={tableColumns as (ColumnGroupType<unknown> | ColumnType<unknown>)[]}
                    dataSource={items}
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
})

type PropsFromRedux = ConnectedProps<typeof connector>;
export default WithNavigate(connector(DealsTable));