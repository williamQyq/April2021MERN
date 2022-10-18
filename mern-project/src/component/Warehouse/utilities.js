import { EditableCell } from "component/Operation/OperationEditableEle"


export const defaultSettings = {
    bordered: true,
    showHeader: true,
    hasData: true,
    scroll: {},
    yScroll: true,
    size: 'default',
    top: 'topRight',
    bottom: 'bottomRight',
    rowKey: "_id",
    tableLayout: "fixed",
    pagination: {
        defaultPageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        position: ['topRight', 'bottomRight']
    },
    components: {
        body: {
            cell: EditableCell
        }
    },
}

export const needToShipColumns =
    [
        {
            title: "orderID",
            dataIndex: "orderID",
            editable: true,
            searchable: true,
            // width: "20%",
        },
        {
            title: "trackingID",
            dataIndex: "trackingID",
            editable: true,
            searchable: true,
            // width: "15%"
        },
        {
            title: "upc",
            dataIndex: "upc0",
            editable: true,
            searchable: true,
            // width: "10%"
        },
        {
            title: "qty",
            dataIndex: "upc0Qty",
            editable: true,
            width: "5%"
        },
        {
            title: "bundle I",
            dataIndex: "upc1",
            editable: true,
            searchable: true,
            // width: "10%"
        },
        {
            title: "qty",
            dataIndex: "upc1Qty",
            editable: true,
            width: "5%"
        },
        {
            title: "bundle II",
            dataIndex: "upc2",
            editable: true,
            searchable: true,
            // width: "10%"
        },
        {
            title: "qty",
            dataIndex: "upc2Qty",
            editable: true,
            width: "5%"
        }
    ]

export const searchShipmentColumns = [
    {
        title: "OrderId",
        dataIndex: "orderID",
        editable: false,
        searchable: true,
        // width: "20%",
    },
    {
        title: "TrackingId",
        dataIndex: "trackingID",
        editable: false,
        searchable: true,
        // width: "15%"
    },
    {
        title: "UPC",
        dataIndex: "upc",
        editable: false,
        searchable: true,
        // width: "10%"
    },
    {
        title: "Qty",
        dataIndex: "qty",
        editable: false,
    },
    {
        title: "SN",
        dataIndex: "sn",
        searchable: true,
    },
    {
        title: "Create Time",
        dataIndex: "crtTm",
        searchable: true,
        sorter: (a, b) => a.crtStmp - b.crtStmp,
        responsive: ["xxl"]
    },
    {
        title: "Shipped Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
        responsive: ["xxl"]
    },
    {
        title: "Orgnization",
        dataIndex: "orgNm",
        searchable: true,
    },
    {
        title: "Ship By",
        dataIndex: "shipBy",
        searchable: true,
        responsive: ["xxl"]
    },
    {
        title: "status",
        dataIndex: "status",
        searchable: true,
        responsive:["xxl"]
    }
]

export const searchReceivedShipmentColumns = [

    {
        title: "TrackingId",
        dataIndex: "trackingID",
        editable: false,
        searchable: true,
        // width: "15%"
    },
    {
        title: "UPC",
        dataIndex: "upc",
        editable: false,
        searchable: true,
        // width: "10%"
    },
    {
        title: "Qty",
        dataIndex: "qty",
        editable: false,
        width: "5%"
    },
    {
        title: "Create Time",
        dataIndex: "crtTm",
        searchable: true,
        sorter: (a, b) => a.crtStmp - b.crtStmp,
    },
    {
        title: "Latest Modify Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp
    },
    {
        title: "Orgnization",
        dataIndex: "orgNm",
        width: "8%"
    }
]

export const searchLocationInventoryColumns = [

    {
        title: "Location ID",
        dataIndex: "loc",
        editable: false,
        searchable: true,
        // width: "15%"
    },
    {
        title: "UPC",
        dataIndex: "upc",
        editable: false,
        searchable: true,
        // width: "10%"
    },
    {
        title: "Qty",
        dataIndex: "qty",
        editable: false,
        width: "10%"
    },
    {
        title: "Modify Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
    },
]

export const searchSellerInventoryColumns = [

    {
        title: "Orgnization",
        dataIndex: "org",
        searchable: true,
        sorter: (a, b) => a.org.charCodeAt(0) - b.org.charCodeAt(0),
        align: 'center'
    },
    {
        title: "UPC",
        dataIndex: "upc",
        editable: false,
        searchable: true,
        align: 'right',
    },
    {
        title: "Qty",
        dataIndex: "qty",
        editable: false,
        width: "10%",
        sorter: (a, b) => a.qty - b.qty,
        align: 'center'
    },

    {
        title: "Last Updated Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
        align: 'center',
    },
]