import { InputNumber, Input, Form, Space, Typography, Badge, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
const { Link } = Typography;

/*
 *  @usage: Nested child table elements
 */
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
    const inputNode = inputType === 'number' ? <InputNumber min={0} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
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

/*  
 * @usage: Main Table
 * @desc: Columns of parent table
 */
export const mergedColumns = (actions) => {
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
            render: (_, record) => <Action actions={actions} record={record} />
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
                editing: actions.isEditing(record)
            })
        }
    });

}

/*
 * @usage: Columns of nested Table
 * @parameter: action handler
 */
export const nestedTableColumns = (actions) => {

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
                    <Badge status="processing" />
                    Processing
                </span>

        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => <Action actions={actions} record={record} />
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
                editing: actions.isEditing(record)
            })
        }
    });
}

/* 
 * @usage: main table and nested child tables action  
 */
const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
)

const Action = ({ actions, record }) => {
    const editable = actions.isEditing(record);
    return editable ? (
        <Space size="middle">
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    actions.save(record.key)
                }}
            >
                Save
            </Link>
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    actions.cancel();
                }}
            >
                Cancel
            </Link>
        </Space>) : (
        <Space size="middle">
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    actions.publish(record)
                }}
            >Publish</Link>
            <Link
                disabled={actions.editingKey !== ""}
                onClick={(e) => {
                    e.stopPropagation();
                    actions.edit(record)
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
