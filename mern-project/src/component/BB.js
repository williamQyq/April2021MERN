import React from 'react';
import 'antd/dist/antd.css';
import '../styles/bb.scss';
import { connect } from 'react-redux';
import { getBBItems } from 'reducers/actions/itemBBActions';
import { setTableState } from 'reducers/actions/itemActions';
import { BESTBUY } from 'reducers/actions/types';
import PropTypes from 'prop-types';
import { Table, Input, Button, Space, Typography, Row, Menu, Dropdown, Divider, Col, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import {
    SearchOutlined,
    DownOutlined,
    PlusCircleOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';

const { Title, Text } = Typography;

class BB extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            loading: true,
            tableRowHight: 75.31,   //antd table row height
        };

    }

    componentDidMount() {
        this.props.getBBItems();
        this.handleScrollPosition();
    }


    handleScrollPosition = () => {
        const { items, itemDetail } = this.props.bestbuy;

        let index = 0;
        if (itemDetail) {
            index = items.findIndex(item => item.sku === itemDetail.sku);
            this.setState({ searchedRowId: itemDetail._id })
        }
        let v = document.getElementsByClassName("ant-table-body")[0];
        v.scrollTop = this.state.tableRowHight * (index - 3);
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
        const path = this.props.match.path;
        const data = this.props.items;
        const { loading } = this.state;

        //create columns data based on dataIndex
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                ...this.getColumnSearchProps('name'),
                // sorter: (a, b) => a.name.length - b.name.length,
                // sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'UPC',
                dataIndex: 'upc',
                key: 'upc',
                width: '15%',
                ...this.getColumnSearchProps('upc'),
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                key: 'quantity',
                width: '10%',
                sorter: (a, b) => a.qty - b.qty,
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
                render: (text, record) => (
                    <Space size="middle">
                        <Dropdown overlay={menu(record)} placement="bottomCenter">
                            <a href="# " className="ant-dropdown-link" >
                                More Actions <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                ),
            },

        ];

        const menu = (record) => (
            <Menu>
                <Menu.Item key="AddToWatchList">
                    <Button disabled className="menu-btn">
                        <PlusCircleOutlined />
                    </Button>
                </Menu.Item>
                <Menu.Item key="GetItemDetail">

                    <Button className="menu-btn" onClick={() => this.handleClick(BESTBUY, record._id)}>
                        <Link to={`${path}/item-detail`}>
                            <SearchOutlined />
                        </Link>
                    </Button>

                </Menu.Item>
                <Menu.Item key="AddToCart">
                    <Button disabled className="menu-btn">
                        <ShoppingCartOutlined />
                    </Button>
                </Menu.Item>
            </Menu >
        );

        return (
            <React.Fragment>
                <Row gutter={16} style={{ alignItems: 'center' }}>
                    <Col>
                        <Title level={4}>Best Buy</Title>
                    </Col>
                    <Col>
                        <Button type="primary" disabled={loading} loading={loading}>
                            Retrieve Now
                        </Button>
                    </Col>
                </Row>
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
                    scroll={{ y: "calc(100vh - 335px)" }}
                />
            </React.Fragment>
        )
    }
}

BB.prototypes = {
    setTableState: PropTypes.func.isRequired,
    getBBItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
    bestbuy: state.bestbuy,
    items: state.bestbuy.items
})

export default withRouter(connect(mapStateToProps, { getBBItems, setTableState })(BB));