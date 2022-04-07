import React from 'react';
import './Operation.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Form, Typography, Input, Button, Space } from 'antd';
import { defaultSettings, title, footer } from 'component/Operation/Settings.js';
import { EditableCell, mainColumns } from 'component/Operation/OperationEditableEle.js';
import { getProductPricing } from 'reducers/actions/operationActions.js';
import OperationMenu from 'component/Operation/OperationMenu';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { io } from 'socket.io-client';

const socket = io('/', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 5
});

const { Title } = Typography;

class OperationProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultSettings,
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            editingKey: '',
        };
    }

    formRef = React.createRef();

    componentDidMount() {
        this.props.getProductPricing()
        socket.on(`amzProdPricing`, () => {
            this.props.getProductPricing();
        })
    }
    isLoading = () => {
        const { loading } = this.props;
        return loading;
    }
    isEditing = (record) => record._id === this.state.editingKey

    edit = (record) => {
        this.formRef.current.setFieldsValue({
            ...record
        })
        this.setState({
            editingKey: record._id
        })
    }
    cancel = () => {
        this.setState({
            editingKey: ""
        })
    }
    save = async (key) => {
        try {
            const row = await this.formRef.current.validateFields();
            const newData = [...this.state.data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                this.setState({ data: newData });
                this.setState({ editingKey: "" });
            } else {
                newData.push(row);
                this.setState({ newData });
                this.setState({ editingKey: "" });
            }
        } catch (err) {
            console.log("Validate Failed:", err);
        }
    }

    publish = (record) => {
        //publish record to amazon seller central...

    }

    handler = {
        handleToggle: prop => enable => {
            this.setState({ [prop]: enable });
        },

        handleSizeChange: e => {
            this.setState({ size: e.target.value });
        },

        handleTableLayoutChange: e => {
            this.setState({ tableLayout: e.target.value });
        },

        // handleExpandChange = enable => {
        //     this.setState({ expandable: enable ? this.state.expandable : undefined });
        // };

        handleEllipsisChange: enable => {
            this.setState({ ellipsis: enable });
        },

        handleTitleChange: enable => {
            this.setState({ title: enable ? title : undefined });
        },

        handleHeaderChange: enable => {
            this.setState({ showHeader: enable ? true : false });
        },

        handleFooterChange: enable => {
            this.setState({ footer: enable ? footer : undefined });
        },

        handleRowSelectionChange: enable => {
            this.setState({ rowSelection: enable ? {} : undefined });
        },

        handleYScrollChange: enable => {
            this.setState({ yScroll: enable });
            let scroll = { ...this.state.scroll };
            if (enable) {
                scroll.y = "calc(100vh - 335px)"
                this.setState({ scroll })
            }
        },

        handleXScrollChange: e => {
            this.setState({ xScroll: e.target.value });
            // if (xScroll) {
            //     scroll.x = '100vw';
            // }
        },

        handleDataChange: hasData => {
            this.setState({ hasData });
        },
        handlePaginationTopChange: e => {
            this.setState({ top: e.target.value })
        },
        handlePaginationBottomChange: e => {
            this.setState({ bottom: e.target.value })
        },
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
        const { xScroll, yScroll, top, bottom, ...state } = this.state;
        const { sellingPartner } = this.props;

        const actions = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            publish: this.publish,
            editingKey: this.state.editingKey,
            getColumnSearchProps: this.getColumnSearchProps,
            handleSearch: this.handleSearch,
            handleReset: this.handleReset
        }
        const columns = mainColumns(actions)

        return (
            <>
                <Title level={4}>Pricing Table</Title>
                <OperationMenu handler={this.handler} {...this.state} />

                <Form ref={this.formRef} component={false}>
                    <Table
                        {...this.state}
                        loading={this.isLoading}
                        components={{
                            body: {
                                cell: EditableCell,
                            }
                        }}
                        pagination={{ position: [top, bottom] }}
                        columns={columns}
                        dataSource={state.hasData ? sellingPartner : null}
                        scroll={state.scroll}
                    />
                </Form>
            </>
        );
    }
}

OperationProductList.prototypes = {
    getProductPricing: PropTypes.func.isRequired,
    sellingPartner: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    // socket: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
    sellingPartner: state.amazon.sellingPartner,
    loading: state.amazon.loading,
    // socket: state.item.socket
})

export default connect(mapStateToProps, { getProductPricing })(OperationProductList);