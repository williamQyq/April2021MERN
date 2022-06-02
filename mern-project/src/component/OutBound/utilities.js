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
        }
    ]

export const inventoryReceivedColumns = [
    {
        title: "Created Time",
        dataIndex: "crtTm",
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
        dataIndex: "upc",
        editable: true,
        searchable: true,
        width: "20%",
    },
    {
        title: "Tracking ID",
        dataIndex: "trackingId",
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