import React from 'react';
import { connect } from 'react-redux';
import { getCCItems } from '../../reducers/actions/itemCCActions';
import PropTypes from 'prop-types';
import { Table, Input, Button, Space, Typography, Row, Menu, Dropdown } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, PlusCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title } = Typography;

class CC extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // socket: this.props.socket,
            searchText: '',
            searchedColumn: '',
            loading: false,
        };

    }

    componentDidMount() {
        this.props.getCCItems();
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
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
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

    handleClick = (e) => {
        e.preventDefault();
    }
    render() {
        const data = this.props.cc_item.items;
        //create columns data based on dataIndex
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                ...this.getColumnSearchProps('name'),
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend', 'ascend'],

            },
            {
                title: 'UPC',
                dataIndex: 'upc',
                key: 'upc',
                width: '20%',
                ...this.getColumnSearchProps('upc'),
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                key: 'quantity',
                width: '10%',

                sorter: (a, b) => a.qty - b.qty,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Current Price',
                dataIndex: 'price',
                key: 'price',
                width: '10%',
            },
            {
                title: 'Created Date',
                dataIndex: 'created_date',
                key: 'created_date',
                width: '10%',
                sorter: (a, b) => new Date(a.created_date) - new Date(b.created_date),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: 'Action',
                key: 'action',
                width: '10%',
                render: (text, record) => (
                    <Space size="middle">
                        <Dropdown overlay={menu} placement="bottomCenter">
                            <a href="# " className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                More Actions <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                ),
            },
        ];
        const { loading } = this.state;

        const menu = (
            <Menu>
                <Menu.Item>
                    <Button className="menu-btn">
                        <PlusCircleOutlined />
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button className="menu-btn">
                        <SearchOutlined />
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button className="menu-btn">
                        <ShoppingCartOutlined />
                    </Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <React.Fragment>
                <Row gutter={16} style={{ alignItems: 'center' }}>
                    <Title level={3} className="title">CostCo</Title>
                </Row>
                <Button type="primary" onClick={e => this.handleClick(e)} disabled={loading} loading={loading}>
                    Reload
                </Button>
                <Table columns={columns}
                    dataSource={data}
                    pagination={{
                        defaultPageSize: 20,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100']
                    }}
                    scroll={{ y: "calc(100vh - 320px)" }} />

            </React.Fragment>
        )
    }
}

CC.prototypes = {
    getCCItems: PropTypes.func.isRequired,

    cc_item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    cc_item: state.cc_item
})

export default connect(mapStateToProps, { getCCItems })(CC);