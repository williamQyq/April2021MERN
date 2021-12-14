import { InputNumber, Input, Form, Space, Typography, Badge, Dropdown, Menu } from "antd";
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
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const editable = action.isEditing(record);
                return editable ? (
                    <Space>
                        <Typography.Link
                            onClick={(e) => {
                                e.stopPropagation();
                                action.save(record.key)
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Typography.Link
                            onClick={(e) => {
                                e.stopPropagation();
                                action.cancel();
                            }}
                        >
                            Cancel
                        </Typography.Link>
                    </Space>) : (
                    <Space size="middle">
                        <a>Publish</a>
                        <Typography.Link
                            disabled={action.editingKey !== ""}
                            onClick={(e) => {
                                e.stopPropagation();
                                action.edit(record)
                            }}
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

// Columns of nested Table
// @parameter: action handler
export const nestedTableColumns = (action) => [
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
        dataIndex: 'profitSettlementRate',
        key: 'profitSettlementRate',
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
        render: (_, record) => {
            const editable = action.isEditing(record);
            return editable ? (
                <Space size="middle">
                    <Link
                        onClick={(e) => {
                            e.stopPropagation();
                            action.save(record.key)
                        }}
                    >
                        Save
                    </Link>
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
                        Edit Profit Rate
                    </Link>
                    <Dropdown overlay={menu}>
                        <Link>
                            More <DownOutlined />
                        </Link>
                    </Dropdown>
                </Space>
            )
        },
    }
];

// menu of nested table operation cell
const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
)

const ActionRender = (props) => {
    console.log(`props:${JSON.stringify(props)}`)
    const { action, record } = props
    const editable = action.isEditing(record);
    return editable ? (
        <Space size="middle">
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    action.save(record.key)
                }}
            >
                Save
            </Link>
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
                Edit Profit Rate
            </Link>
            <Dropdown overlay={menu}>
                <Link>
                    More <DownOutlined />
                </Link>
            </Dropdown>
        </Space>
    )
}