import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Form, Typography, Input, Button, Space } from 'antd';
import { defaultSettings, needToShipColumns } from 'component/OutBound/utilities.js';
import OutBoundMenu from 'component/Operation/OperationMenu';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { SocketContext } from 'component/socket/socketContext';
import { ContentHeader } from 'component/SourceStore/StoreTableUtilities';

class NeedToShipUpload extends React.Component {
    static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
            editingKey: '',
            data: [],
            defaultSettings: { ...defaultSettings },
        };
    }
    formRef = React.createRef()

    componentDidMount() {
        let socket = this.context
        socket.emit(`subscribe`, `OutboundRoom`);

    }

    componentWillUnmount() {
        let socket = this.context
        socket.emit(`unsubscribe`, `OutboundRoom`)
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
        const { data, defaultSettings } = this.state;
        const { loading } = this.props;
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
        const columns = needToShipColumns(actions);
        return (
            <>
                <ContentHeader title="Need To Ship" />
                <OutBoundMenu {...this.state} />
                <Form ref={this.formRef} component={false}>
                    <Table
                        {...defaultSettings}
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                    />
                </Form>
                {/* <BackTopHelper /> */}
            </>

        );
    }
}

NeedToShipUpload.prototypes = {
    getProductPricing: PropTypes.func.isRequired,
    sellingPartner: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
}
const mapStateToProps = (state) => ({
    sellingPartner: state.amazon.sellingPartner,
    loading: state.amazon.loading,
})

export default connect(mapStateToProps, {})(NeedToShipUpload);