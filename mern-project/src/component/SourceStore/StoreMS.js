import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getMSItems } from 'reducers/actions/itemMSActions';
import { setTableState } from 'reducers/actions/itemActions';   //save user's table settings
import { MICROSOFT } from 'reducers/actions/types';
import PropTypes from 'prop-types';
import { Table, Input, Button, Space, Typography, Row, Menu, Dropdown, Divider, Col, Tooltip, Upload } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    DownOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { scrollToTableRow, locateSearchedItem, tableColumns, StoreHeader } from 'component/SourceStore/StoreTableUtilities';

const { Title, Text } = Typography;

class MS extends React.Component {
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
        this.props.getMSItems();
        this.handleScrollPosition(this.props.items, this.props.itemDetail);
    }


    handleScrollPosition = (items, searchedItem) => {
        if (searchedItem) {
            let item = locateSearchedItem(items, searchedItem._id);
            this.setState({ searchedRowId: item._id });
            scrollToTableRow(document, item.index);
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

    handleClick = (store, _id) => {
        this.props.setTableState(store, _id);
    };

    render() {
        const data = this.props.items;
        const scroll = { y: "calc(100vh - 335px)" };
        const columns = tableColumns(this.getColumnSearchProps, this.handleClick, MICROSOFT)

        return (
            <>
                <StoreHeader storeName={MICROSOFT} isLoading={this.state.loading} />
                <Divider />
                <Table
                    showSorterTooltip={false}
                    columns={columns}
                    dataSource={data}
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

MS.prototypes = {
    setTableState: PropTypes.func.isRequired,
    getMSItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    itemDetail: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.microsoft.items,
    itemDetail: state.item.itemDetail
})

export default connect(mapStateToProps, { getMSItems, setTableState })(MS);