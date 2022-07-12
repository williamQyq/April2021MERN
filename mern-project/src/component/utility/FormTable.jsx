import React from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const addSearchPropsToColumns = (columns, getColumnSearchProps) => {
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


export default class FormTable extends React.Component {
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
        let v = document.getElementsByClassName("ant-table-body")[0];
        v.scrollTop = tableRowHight * (row - 3);
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
                let isValueIncluded = record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '';
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
        const { data, loading, columns, tableSettings } = this.props
        const searchPropsColumns = addSearchPropsToColumns(columns, this.getColumnSearchProps);
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