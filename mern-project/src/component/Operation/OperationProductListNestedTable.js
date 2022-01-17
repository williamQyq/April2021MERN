import React from 'react';
import 'antd/dist/antd.css';
import { Table, Form } from 'antd';
import { EditableCell, nestedTableColumns } from 'component/Operation/OperationEditableEle';

export default class NestedTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: "",
            record: props.record,
        }
    }

    formRef = React.createRef();

    getAmzRecord = (record) => {
        const data = [];
        record.identifiers.forEach(identifier => {

            if (identifier.offers == null) {
                data.push({
                    key: identifier._id,
                    asin: identifier.asin,
                })

            } else {
                identifier.offers.forEach(offer => {
                    data.push({
                        key: identifier._id,
                        asin: identifier.asin,
                        sku: offer.SellerSKU,
                        fulfillmentChannel: offer.FulfillmentChannel,
                        amzRegularPrice: offer.RegularPrice.Amount,
                    })
                })
            }
        })

        return data
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    }

    edit = (record) => {
        this.formRef.current.setFieldsValue({
            ...record
        })
        this.setState({
            editingKey: record.key
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

    render() {
        const actions = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            editingKey: this.state.editingKey
        }
        const columns = nestedTableColumns(actions);  //pass handler to create nested Table columns
        const { record } = this.props
        return (
            <Form ref={this.formRef} component={false} >
                <Table
                    components={{
                        body: {
                            cell: EditableCell
                        }
                    }}
                    columns={columns}
                    dataSource={this.getAmzRecord(record)}
                    pagination={false}
                />
            </Form>
        )
    }

};
