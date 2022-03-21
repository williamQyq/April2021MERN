import ActionMenu from "component/Operation/OperationAction";
import { StatusBadge } from "component/Operation/OperationStatusBadge";


export const mainColumnGroup = (actions) => {
    const { getColumnSearchProps } = actions;
    return (
        [
            {
                title: 'Upc',
                dataIndex: 'upc',
                editable: true,
                ...getColumnSearchProps('upc')
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
                sorter: (a, b) => a.wmsQuantity - b.wmsQuantity,
                ...getColumnSearchProps('wmsQuantity'),
                // defaultSortOrder: setTableState.wmsQuantity,
                sortDirections: ['descend', 'ascend', 'descend']
            },
            {
                title: 'Unit Cost',
                dataIndex: 'unitCost',
                editable: false,
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
                ...getColumnSearchProps('status'),
                render: (_, record) => {
                    return <StatusBadge record={record} />
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => <ActionMenu actions={actions} record={record} />,
            },
        ]
    );
}

export const nestedColumnGroup = (actions) => [
    {
        title: 'Asin',
        dataIndex: 'asin',
        key: 'asin',
        editable: false
    },
    {
        title: 'Sku',
        dataIndex: 'SellerSKU',
        key: 'sku',
        editable: false
    },
    {
        title: 'Fulfillment Channel',
        dataIndex: 'FulfillmentChannel',
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
        dataIndex: ['RegularPrice', 'Amount'],
        key: 'amzRegularPrice',
        editable: false
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
        render: (_, record) => <StatusBadge record={record} />

    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => <ActionMenu actions={actions} record={record} />
    }
];