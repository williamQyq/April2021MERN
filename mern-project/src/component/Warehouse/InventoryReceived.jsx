import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { defaultSettings, inventoryReceivedColumns } from 'component/Warehouse/utilities.js';
import { InventoryReceivedMenu } from './Menus.jsx';
import FormTable from 'component/utility/FormTable.jsx';
import { getInventoryReceived } from 'reducers/actions/outboundActions.js';

class InventoryReceived extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    formRef = React.createRef()

    componentDidMount() {

        this.props.getInventoryReceived()
    }

    componentWillUnmount() {

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
        const { loading, inventoryReceivedItems } = this.props;
        return (
            <>
                <InventoryReceivedMenu />
                <Form ref={this.formRef} component={false}>
                    <FormTable
                        loading={loading}
                        data={inventoryReceivedItems}
                        columns={inventoryReceivedColumns}
                        tableSettings={defaultSettings}
                    />
                </Form>
            </>

        );
    }
}

InventoryReceived.prototypes = {
    getInventoryReceived: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    inventoryReceivedItems: PropTypes.array.isRequired
}
const mapStateToProps = (state) => ({
    loading: state.warehouse.inventoryReceivedLoading,
    inventoryReceivedItems: state.warehouse.inventoryReceivedItems
})

export default connect(mapStateToProps, { getInventoryReceived })(InventoryReceived);