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
    }
}

export const needToShipColumns =
    [
        {
            title: "orderId",
            dataIndex: "orderId",
            editable: true,
            searchable: true,
            width: "10%",
        },
        {
            title: "trackingNo",
            dataIndex: "trackingNo",
            editable: true,
            searchable: true,
            width: "10%"
        },
        {
            title: "upc",
            dataIndex: "upc",
            editable: true,
            searchable: true,
            width: "10%"
        },
        {
            title: "upc qty",
            dataIndex: "upc qty",
            editable: true,
            width: "10%"
        },
        {
            title: "bundle I",
            dataIndex: "bundle_1",
            editable: true,
            searchable: true,
            width: "10%"
        },
        {
            title: "bundle I Qty",
            dataIndex: "bundle_1_qty",
            editable: true,
            width: "10%"
        },
        {
            title: "bundle II",
            dataIndex: "bundle_2",
            editable: true,
            searchable: true,
            width: "10%"
        },
        {
            title: "bundle II Qty",
            dataIndex: "bundle_2_qty",
            editable: true,
            width: "10%"
        },
        {
            title: "RMA Item",
            dataIndex: "rmaItem",
            editable: true,
            searchable: true,
            width: "10%"
        },
        {
            title: "RMA Item Qty",
            dataIndex: "rmaItemQty",
            editable: true,
            width: "10%"
        },
    ]

export const inventoryReceivedColumns = [
    {
        title: "Lastest Modified Time",
        dataIndex: "mdfTmEst",
        editable: false,
        searchable: true,
        width: "20%",
    },
    {
        title: "Organization Name",
        dataIndex: "orgNm",
        editable: true,
        searchable: true,
        width: "20%",
    },
    {
        title: "UPC",
        dataIndex: "UPC",
        editable: true,
        searchable: true,
        width: "20%",
    },
    {
        title: "Tracking ID",
        dataIndex: "trNo",
        editable: true,
        searchable: true,
        width: "20%",
    },
    {
        title: "Quantity",
        dataIndex: "qty",
        editable: true,
        width: "20%",
    }

]