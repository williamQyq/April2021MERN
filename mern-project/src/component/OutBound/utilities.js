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

export const needToShipColumns = (props) => {
    const { getColumnSearchProps } = props;
    return (
        [
            {
                title: "orderId",
                dataIndex: "orderId",
                editable: true,
                width: "10%",
                ...getColumnSearchProps('orderId')
            },
            {
                title: "trackingNo",
                dataIndex: "trackingNo",
                editable: true,
                width: "10%",
                ...getColumnSearchProps('trackingNo')
            }
        ]
    );

}

export const inventoryReceivedColumns = (props) => {
    const { getColumnSearchProps } = props;
    return (
        [
            {
                title: "Created Time",
                dataIndex: "crtTm",
                editable: false,
                width: "20%",
                ...getColumnSearchProps('crtTm')
            },
            {
                title: "Organization Name",
                dataIndex: "orgNm",
                editable: true,
                width: "20%",
                ...getColumnSearchProps('orgNm')
            },
            {
                title: "UPC",
                dataIndex: "upc",
                editable: true,
                width: "20%",
                ...getColumnSearchProps('upc')
            },
            {
                title: "Tracking ID",
                dataIndex: "trackingId",
                editable: true,
                width: "20%",
                ...getColumnSearchProps('trackingId')
            },
            {
                title: "Quantity",
                dataIndex: "qty",
                editable: true,
                width: "20%",
                ...getColumnSearchProps('qty')
            }
            
        ]
    );

} 