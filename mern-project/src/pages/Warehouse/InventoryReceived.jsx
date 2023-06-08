import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { defaultSettings, searchReceivedShipmentColumns } from '@src/component/Warehouse/util';
import InventoryReceivedControlPanel from './InventoryReceivedControlPanel.jsx';
import FormTable from '@src/component/utils/FormTable';
import { getInventoryReceived } from '@redux-action//inboundActions.js';
import { ContentHeader } from '@src/component/utils/Layout.jsx';

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
                <ContentHeader title="InventoryReceived" />
                <InventoryReceivedControlPanel />
                <Form ref={this.formRef} component={false}>
                    <FormTable
                        loading={loading}
                        data={inventoryReceivedItems}
                        columns={searchReceivedShipmentColumns}
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
const mapStateToProps = (state) => {
    const { inventoryReceivedItems, inventoryReceivedLoading } = state.warehouse.inventoryReceived;
    return ({
        loading: inventoryReceivedLoading,
        inventoryReceivedItems: inventoryReceivedItems
    })
}

export default connect(mapStateToProps, { getInventoryReceived })(InventoryReceived);