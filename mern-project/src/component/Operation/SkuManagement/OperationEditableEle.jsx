import { InputNumber, Input, Form} from "antd";
import { StatusBadge } from "component/Operation/SkuManagement/OperationStatusBadge.jsx";
import ActionMenu from "component/Operation/SkuManagement/OperationAction.jsx";
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
                    style={{ "marginBottom": 0 }}
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
const mergedColumns = (columns, actions) => {

    return columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType ? col.inputType : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: actions.isEditing(record),
            }),

        }
    });

}

export const mainColumns = (actions) => {
    const columns = [
        {
            title: 'Upc',
            dataIndex: 'upc',
            editable: true,
            width: '40%',
            searchable: true
        },
        // {
        //     title: 'Name',
        //     dataIndex: 'name',
        //     editable: true,
        // },
        {
            title: 'WMS Quantity',
            dataIndex: 'wmsQuantity',
            editable: false,
            width: '10%',
            sorter: (a, b) => {
                if (a.wmsQuantity === undefined) {
                    return -1;
                } else if (b.wmsQuantity === undefined) {
                    return 1;
                }
                return a.wmsQuantity - b.wmsQuantity
            }
            ,
            searchable: true,
            defaultSortOrder: 'descend'
            // sortDirections: ['descend', 'ascend', 'descend']
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitCost',
            editable: false,
            width: '10%',
        },
        // {
        //     title: 'Settlement Rate Universal',
        //     dataIndex: 'settleRateUniv',
        //     editable: true,
        //     inputType: "number"
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'state',
            width: '20%',
            // searchable: true,
            render: (_, record) => {
                return <StatusBadge record={record} />
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_, record) => <ActionMenu actions={actions} record={record} />,
        },
    ];
    return mergedColumns(columns, actions);
}
export const nestedColumns = (actions) => {
    const columns = [
        {
            title: 'Asin',
            dataIndex: 'asin',
            key: 'asin',
            editable: false,
            width: '20%',
        },
        {
            title: 'Sku',
            dataIndex: 'SellerSKU',
            key: 'sku',
            editable: false,
            width: '30%',
        },
        {
            title: 'Fulfillment Channel',
            dataIndex: 'FulfillmentChannel',
            key: 'fulfillmentChannel',
            editable: false,
            width: '15%',
            filters: [
                {
                    text: 'Amazon',
                    value: 'AMAZON',
                },
                {
                    text: 'Merchant',
                    value: 'MERCHANT',
                },
            ],
            onFilter: (value, record) => record.FulfillmentChannel.includes(value)

        },
        {
            title: 'Amazon Regular Price',
            dataIndex: ['RegularPrice', 'Amount'],
            key: 'amzRegularPrice',
            editable: false,
            width: '15%',
        },
        // {
        //     title: 'Settlement Rate',
        //     dataIndex: 'settlementRate',
        //     key: 'settlementRate',
        //     editable: true
        // },
        // {
        //     title: 'Settlement Price',
        //     dataIndex: 'settlementPrice',
        //     key: 'settlementPrice',
        //     editable: true

        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'state',
            width: '5%',
            render: (_, record) => <StatusBadge record={record} />

        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
            width: '15%',
            render: (_, record) => <ActionMenu actions={actions} record={record} />
        }
    ];
    return mergedColumns(columns, actions)
}