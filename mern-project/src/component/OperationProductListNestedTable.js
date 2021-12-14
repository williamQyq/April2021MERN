import React from 'react';
import 'antd/dist/antd.css';
import { Table, Form } from 'antd';
import { EditableCell, nestedTableColumns } from 'component/OperationEditableEle';

const data = [];
for (let i = 0; i < 5; i++) {
    data.push({
        key: i,
        asin: 'B09G2QZP71',
        sku: '196068763954-16051200H00P-AFBA-4PB5-480',
        fulfillmentChannel: 'MERCHANT',
        amzRegularPrice: 807.99,
        profitSettlementRate: 0.15,
        settlementPrice: 900,
        status: 'complete'
    })
}


export default class NestedTable extends React.Component {

    state = {
        data: data,
        editingKey: "",
    };

    formRef = React.createRef();

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
        const action = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            editingKey: this.state.editingKey
        }
        const columns = nestedTableColumns(action);  //pass handler to create nested Table columns

        return (
            <Form ref={this.formRef} component={false} >
                <Table
                    components={{
                        body: {
                            cell: EditableCell
                        }
                    }}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                />
            </Form>
        )
    }

};
