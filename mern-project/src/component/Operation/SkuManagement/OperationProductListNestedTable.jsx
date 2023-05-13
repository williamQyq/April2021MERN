import React from 'react';
// import 'antd/dist/antd.min.css';
import { Table, Form } from 'antd';
import { EditableCell, nestedColumns } from '@src/component/Operation/SkuManagement/OperationEditableEle.jsx';

export default class NestedTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editingKey: "",
            data: [],
        }
    }

    formRef = React.createRef();
    componentDidMount() {
        this.getAmzRecord(this.props.record);
    }

    getAmzRecord = (record) => {
        const data = [];
        let identifiers = record.identifiers.filter(identifier => identifier.offers != null)
        let index = 0;
        identifiers.forEach(identifier => {
            identifier.offers.forEach(offer => {
                data.push({ ...offer, asin: identifier.asin, key: index })
                index += 1;
            })
        })

        this.setState({ data: data });
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
        const columns = nestedColumns(actions);  //pass handler to create nested Table columns
        const { data } = this.state;
        return (
            <Form ref={this.formRef} component={false} >
                <Table
                    components={{
                        body: {
                            cell: EditableCell
                        }
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            </Form>
        )
    }

};

