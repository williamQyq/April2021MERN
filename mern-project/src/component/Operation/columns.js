import ActionMenu from "component/Operation/OperationAction";
import { StatusBadge } from "component/Operation/OperationStatusBadge";

//main upc,qty,unit cost, status, action columns
export const mainColumnGroup = (actions) => {
    const { getColumnSearchProps } = actions;
    return (
        [
            {
                title: 'Upc',
                dataIndex: 'upc',
                editable: true,
                width: '40%',
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
                ...getColumnSearchProps('wmsQuantity'),
                // defaultSortOrder: setTableState.wmsQuantity,
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
                ...getColumnSearchProps('status'),
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
        ]
    );
}

//nested asin sku table columns
export const nestedColumnGroup = (actions) => [
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
        width:'5%',
        render: (_, record) => <StatusBadge record={record} />

    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        width:'15%',
        render: (_, record) => <ActionMenu actions={actions} record={record} />
    }
];