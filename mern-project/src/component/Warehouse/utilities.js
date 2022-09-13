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
    pagination: { position: ['topRight', 'bottomRight'] },
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
        width: "5%"
    },
    {
        title: "SN",
        dataIndex: "sn",
        searchable: true
    },
    {
        title: "Create Time",
        dataIndex: "crtTm",
        searchable: true,
        sorter: (a, b) => a.crtStmp - b.crtStmp,
    },
    {
        title: "Shipped Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
    },
    {
        title: "Orgnization",
        dataIndex: "orgNm",
        searchable: true,
        width: "8%"
    },
    {
        title: "Ship By",
        dataIndex: "shipBy",
        searchable: true
    },
    {
        title: "status",
        dataIndex: "status",
        searchable: true
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
        title: "Shipped Time",
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
        width: "5%"
    },
    {
        title: "Modify Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
    },
]