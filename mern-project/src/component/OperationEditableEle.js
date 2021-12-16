import { InputNumber, Input, Form, Space, Typography, Badge, Dropdown, Menu, Popconfirm } from "antd";
import { DownOutlined } from '@ant-design/icons';
const { Link } = Typography;


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
                    onClick={(e) => { e.stopPropagation() }}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

// Columns of parent table
export const mergedColumns = (action) => {
    const columns = [
        {
            title: 'Upc',
            dataIndex: 'upc',
            editable: false
        },
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: 'WMS Quantity',
            dataIndex: 'wmsQuantity',
            editable: false,
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitCost',
            editable: false,
        },
        {
            title: 'Settlement Rate Universal',
            dataIndex: 'settleRateUniv',
            editable: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'state',
            render: () =>
                <span>
                    <Badge status="success" />
                    Finished
                </span>

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => <Action action={action} record={record} />
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

// Columns of nested Table
// @parameter: action handler
export const nestedTableColumns = (action) => {

    const columns = [
        {
            title: 'Asin',
            dataIndex: 'asin',
            key: 'asin',
            editable: false
        },
        {
            title: 'Sku',
            dataIndex: 'sku',
            key: 'sku',
            editable: false
        },
        {
            title: 'Fulfillment Channel',
            dataIndex: 'fulfillmentChannel',
            key: 'fulfillmentChannel',
            editable: false,
            filters: [
                {
                    text: 'FBA',
                    value: 'AMAZON',
                },
                {
                    text: 'Merchant',
                    value: 'MERCHANT',
                },
            ],
        },
        {
            title: 'Amazon Regular Price',
            dataIndex: 'amzRegularPrice',
            key: 'amzRegularPrice',
            editable: false
        },
        {
            title: 'Settlement Rate',
            dataIndex: 'settlementRate',
            key: 'settlementRate',
            editable: true
        },
        {
            title: 'Settlement Price',
            dataIndex: 'settlementPrice',
            key: 'settlementPrice',
            editable: true

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'state',
            render: () =>
                <span>
                    <Badge status="success" />
                    Finished
                </span>

        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => <Action action={action} record={record} />
        }
    ];

    return columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "settlementRate" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: action.isEditing(record)
            })
        }
    });
}

// menu of nested table operation cell
const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
)

const Action = ({ action, record }) => {
    const editable = action.isEditing(record);
    const saveChange = () => {
        action.save(record.key)
    }
    return editable ? (
        <Space size="middle">
            <Popconfirm title="Sync to Amz?" onConfirm={saveChange}>
                <Link
                    onClick={(e) => {
                        e.stopPropagation();
                        action.save(record.key)
                    }}
                >
                    Save
                </Link>
            </Popconfirm>
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    action.cancel();
                }}
            >
                Cancel
            </Link>
        </Space>) : (
        <Space size="middle">
            <Link>Publish</Link>
            <Link
                disabled={action.editingKey !== ""}
                onClick={(e) => {
                    e.stopPropagation();
                    action.edit(record)
                }}
            >
                Edit
            </Link>
            <Dropdown overlay={menu}>
                <Link onClick={(e) => { e.stopPropagation(); }}>
                    More <DownOutlined />
                </Link>
            </Dropdown>
        </Space>
    )
}