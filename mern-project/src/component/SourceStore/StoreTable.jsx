import React from 'react';
import 'component/SourceStore/Store.scss';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, } from '@ant-design/icons';
import {
    locateSearchedItem,
    scrollToTableRow,
    defaultTableSettings,
    StoreOperationMenu,
    TableColumns
} from 'component/SourceStore/StoreTableUtilities.js';
// import BackTopHelper from 'component/utility/BackTop';


export default class StoreTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };

    }

    componentDidMount() {
        this.handleScrollPosition(this.props.items, this.props.tableState);
    }

    handleScrollPosition = (items, clickHistory) => {
        if (clickHistory) {
            let itemHistory = locateSearchedItem(items, clickHistory.clickedId)
            this.setState({ searchedRowId: itemHistory._id })
            scrollToTableRow(document, itemHistory.index)
        }
    }

    getColumnSearchProps = dataIndexMulti => {
        const dataIndex = dataIndexMulti[0];    //default
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => {
                let isValueIncluded = false;

                for (let dataIndex of dataIndexMulti) {
                    isValueIncluded = record[dataIndex]
                        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                        : ''
                    if (isValueIncluded) {
                        return true;    //if value is includes in searched data Index multi, return true -- the row includes the value will be rendered
                    }
                }
                return isValueIncluded
            },
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: (text, record) => (
                this.state.searchedColumn === dataIndex ? (
                    <a target="_blank" rel="noopener noreferrer" href={record.link}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#c7edcc', padding: 0 }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        />
                    </a>
                ) : (
                    this.state.searchedRowId === record._id ?
                        <a target="_blank" rel="noopener noreferrer" href={record.link}>
                            <Highlighter
                                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                searchWords={[text]}
                                autoEscape
                                textToHighlight={text ? text.toString() : ''}
                            />
                        </a>
                        :
                        <a target="_blank" rel="noopener noreferrer" href={record.link}>{text}</a>
                ))
        };
    }

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const { items, store, loading } = this.props
        const columns = TableColumns(this.getColumnSearchProps, store);
        return (
            <>
                <StoreOperationMenu store={store} />
                <Table
                    loading={loading}
                    {...defaultTableSettings}
                    columns={columns}
                    dataSource={items}
                />
            </>
        )
    }
}