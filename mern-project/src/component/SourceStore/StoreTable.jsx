import React from 'react';
import 'component/SourceStore/Store.scss';
import { Table, Input, Button, Space, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, } from '@ant-design/icons';
import { locateSearchedItem, scrollToTableRow, StoreHeader } from 'component/SourceStore/StoreTableUtilities';
import { tableColumns } from 'component/SourceStore/StoreTableUtilities';


export default class StoreTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            loading: true,
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

    getColumnSearchProps = dataIndex => ({
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
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: (text, record) => (
            this.state.searchedColumn === dataIndex ? (
                <a target="_blank" rel="noopener noreferrer" href={record.link}>
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
    });

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
        const { items, store } = this.props
        const { loading } = this.state;

        const columns = tableColumns(this.getColumnSearchProps, store);
        const scroll = { y: "calc(100vh - 335px)" };

        return (
            <>
                <StoreHeader storeName={store} isLoading={loading} />
                <Divider />
                <Table
                    showSorterTooltip={false}
                    columns={columns}
                    dataSource={items}
                    pagination={{
                        defaultPageSize: 100,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100']
                    }}
                    scroll={scroll}
                />
            </>
        )
    }
}