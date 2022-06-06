import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { defaultSettings, inventoryReceivedColumns } from 'component/OutBound/utilities.js';
import { SocketContext } from 'component/socket/socketContext';
import { InventoryReceivedMenu } from './Menus.jsx';
import FormTable from 'component/utility/FormTable.jsx';

class InventoryReceived extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    formRef = React.createRef()

    componentDidMount() {
        // let socket = this.context
        // socket.emit(`subscribe`, `OutboundRoom`);

    }

    componentWillUnmount() {
        // let socket = this.context
        // socket.emit(`unsubscribe`, `OutboundRoom`)
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

    render() {
        // const actions = {
        //     isEditing: this.isEditing,
        //     edit: this.edit,
        //     cancel: this.cancel,
        //     save: this.save,
        //     publish: this.publish,
        //     editingKey: this.state.editingKey,
        // }
        const loading = false;
        const data = [];
        const columns = inventoryReceivedColumns;
        return (
            <>
                <InventoryReceivedMenu />
                <Form ref={this.formRef} component={false}>
                    <FormTable
                        loading={loading}
                        data={data}
                        columns={columns}
                        tableSettings={defaultSettings}
                    />
                </Form>
            </>

        );
    }
}

InventoryReceived.prototypes = {
    // loading: PropTypes.bool.isRequired,
}
const mapStateToProps = (state) => ({
    // loading: state.amazon.loading,
})

export default connect(mapStateToProps, {})(InventoryReceived);