import React from 'react';
import { connect } from 'react-redux';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { saveUserTableSettings } from '@redux-action/deal.action';
import '@src/assets/FormTable.scss';
import { normalizeStringValue } from './helper';


class FormTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            data: this.props.data,
            tableState: null // for caching table action history
        };
    }

    componentDidMount() {
        if (this.state.tableState != null) {
            this.handleScrollPosition(this.state.data, this.state.tableState);  //scroll to clicked row
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.searchText !== prevState.searchText) {
            this.props.saveUserTableSettings({
                ...this.state.tableState,
                searchText: this.state.searchText,
                searchedRowId: this.state.searchedRowId,
                searchedColumn: this.state.searchedColumn
            })
        }
    }
    handleTableState = (tableState) => {
        const { searchText, searchedRowId, searchedColumn } = tableState;
        if (tableState.searchText) {
            this.setState({ searchText, searchedRowId, searchedColumn })
        }
    }

    addSearchPropsToColumns = (columns, getColumnSearchProps) => {
        return columns.map(col => {
            if (col.searchable) {
                return {
                    ...col,
                    ...getColumnSearchProps(col.dataIndex)
                }
            }

            return {
                ...col,
            }
        })
    }

    handleScrollPosition = (items, clickHistory) => {
        if (clickHistory) {
            let clickedItem = this.locateSearchedItem(items, clickHistory.clickedId)
            this.setState({ searchedRowId: clickedItem._id })
            this.scrollToTableRow(document, clickedItem.index)
        }
    }

    locateSearchedItem = (items, searchId) => {
        let searchItem = {
            index: 0,
            _id: ""
        }
        if (searchId) {
            for (let index = 0; index < items.length; index++) {
                let currentItemId = items[index]._id;
                if (currentItemId === searchId) {
                    searchItem.index = index;
                    searchItem._id = currentItemId;
                    return searchItem;  //return found item
                }
            }
        }
        return searchItem;  //return default first index item.
    }

    scrollToTableRow = (document, row) => {
        const tableRowHight = 75.31;
        let v = document.getElementsByClassName("ant-layout-content site-layout-content")[0];
        v.scrollTop = tableRowHight * (row - 0);
    }

    getColumnSearchProps = dataIndex => {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [''])}
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
                        {/* <Button
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
                        </Button> */}
                    </Space>
                </div>
            ),
            filteredValue: this.state.searchedColumn === dataIndex ? [this.state.searchText] : [],
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => {
                if (value === undefined) return false;  //if empty searchText, filter no data
                let isValueIncluded = record[dataIndex] ? (
                    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                ) : (
                    false
                );
                return isValueIncluded
            },
            onFilterDropdownOpenChange: visible => {
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
        let trimSearchText = normalizeStringValue(selectedKeys[0]);
        this.setState({
            searchText: trimSearchText,
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


    render() {
        const { data, loading, columns, tableSettings } = this.props
        const searchPropsColumns = this.addSearchPropsToColumns(columns, this.getColumnSearchProps);

        return (
            <Table
                loading={loading}
                {...tableSettings}
                columns={searchPropsColumns}
                dataSource={data}
            />
        )
    }
}
export default connect(null, { saveUserTableSettings })(FormTable);