import React from 'react';
import 'antd/dist/antd.css';
import '../styles/bb.scss';
import { connect } from 'react-redux';
import { getBBItems } from '../reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import { Table, Input, Button, Space, Typography, Row, Menu, Dropdown } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, PlusCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Moment from 'moment';

const { Title } = Typography;

class BB extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: this.props.socket,
            searchText: '',
            searchedColumn: '',
            loading: false,
        };

    }

    componentDidMount() {
        this.props.getBBItems();
        const tableData = this.tableDataPrintable(this.props.bb_item.items)
        this.setState({ tableData: tableData });
    }

    tableDataPrintable = (data) => {
        //convert UTC to EST
        const items = Object.values(data)
        const tableData = items.map(item => {
            let date = new Date(item.created_date);
            item.created_date = Moment(date.setHours(date.getHours() - 4)).format("MM-DD-YYYY HH:mm:ss");
            return item;
        })
        return tableData;
    };

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

    handleClick=(e)=>{
        e.preventDefault();
    }
    render() {

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
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
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
                    <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                        <PlusCircleOutlined />
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                        <SearchOutlined />
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                        <ShoppingCartOutlined />
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <React.Fragment>
                <Row gutter={16} style={{ alignItems: 'center' }}>
                    <Title level={3} className="title">Best Buy</Title>
                </Row>
                <Button type="primary" onClick={e => this.handleClick(e)} disabled={loading} loading={loading}>
                    Reload
                </Button>
                <Table columns={columns}
                    dataSource={this.state.tableData}
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

BB.prototypes = {
    getBBItems: PropTypes.func.isRequired,

    bb_item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    bb_item: state.bb_item
})

export default connect(mapStateToProps, { getBBItems })(BB);