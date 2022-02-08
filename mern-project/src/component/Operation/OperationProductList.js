import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Table, Form, Typography } from 'antd';
import { defaultSettings, title, footer } from 'component/Operation/Settings.js';
import { EditableCell, mergedColumns } from 'component/Operation/OperationEditableEle.js';
import { getProductPricing } from 'reducers/actions/operationActions.js';
import OperationMenu from 'component/Operation/OperationMenu';
import { io } from 'socket.io-client';

const socket = io('localhost:3000', {
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

    render() {
        const { xScroll, yScroll, top, bottom, ...state } = this.state;
        const { loading, sellingPartner } = this.props;

        const actions = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            publish: this.publish,
            editingKey: this.state.editingKey
        }
        const columns = mergedColumns(actions)

        return (
            <>
                <Title level={4}>Pricing Table</Title>
                <OperationMenu handler={this.handler} {...this.state} />

                <Form ref={this.formRef} component={false}>
                    <Table
                        {...this.state}
                        loading={loading}
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