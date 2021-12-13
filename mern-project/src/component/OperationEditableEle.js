import { InputNumber, Input, Form, Space, Typography } from "antd";
import { DownOutlined, SaveFilled } from '@ant-design/icons';

export const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const mergedColumns = (action) => {
    const columns = [
        {
            title: 'Upc',
            dataIndex: 'upc',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'WMS Quantity',
            dataIndex: 'wmsQuantity'
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitCost'
        },
        {
            title: 'Settlement Rate Universal',
            dataIndex: 'settleRateUniv',
            editable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const editable = action.isEditing(record);
                return editable ? (
                    <Space>
                        <Typography.Link
                        // onClick={() => save(record.key)}
                        >
                            Save
                        </Typography.Link>
                        <Typography.Link
                            onClick={() => action.cancel()}
                        >
                            Cancel
                        </Typography.Link>
                    </Space>) : (
                    <Space size="middle">
                        <a>Publish</a>
                        <Typography.Link
                            disabled={action.editingKey !== ""}
                            onClick={() => action.edit(record)}
                        >
                            Edit Settlement Rat
                        </Typography.Link>
                        <a className="ant-dropdown-link">
                            More actions <DownOutlined />
                        </a>
                    </Space>
                )
            }
        },
    ];

    return columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "settleRateUniv" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: action.isEditing(record)
            })
        }
    });

}
