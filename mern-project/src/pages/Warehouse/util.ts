import { EditableCell } from "@src/component/Operation/SkuManagement/OperationEditableEle.jsx"
import { ColumnTypeWithSearchable } from "@src/component/utils/FormTable";
import { TableProps } from "antd";


export const defaultSettings: Partial<TableProps<any>> = {
    bordered: true,
    showHeader: true,
    scroll: {},
    size: 'middle',
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
interface ShipmentDocument {
    crtStmp: number;
    mdfStmp: number;
}
export type SearchableColumnsType<T = any> = ColumnTypeWithSearchable<T>[];
export const needToShipColumns: SearchableColumnsType<ShipmentDocument> = [
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


export const searchShipmentColumns: SearchableColumnsType<ShipmentDocument> = [
    {
        title: "OrderId",
        dataIndex: "orderID",
        editable: false,
        searchable: true,
        align: "center"
        // width: "20%",
    },
    {
        title: "TrackingId",
        dataIndex: "trackingID",
        editable: false,
        searchable: true,
        align: "center"
        // width: "15%"
    },
    {
        title: "UPC",
        dataIndex: "upc",
        editable: false,
        searchable: true,
        align: "center"
        // width: "10%"
    },
    {
        title: "Qty",
        dataIndex: "qty",
        editable: false,
        align: "center"
    },
    {
        title: "SN",
        dataIndex: "sn",
        searchable: true,
        align: "center"
    },
    {
        title: "Create Time",
        dataIndex: "crtTm",
        searchable: true,
        sorter: (a, b) => a.crtStmp - b.crtStmp,
        responsive: ["xxl"],
        align: "center"
    },
    {
        title: "Shipped Time",
        dataIndex: "mdfTm",
        searchable: true,
        sorter: (a, b) => a.mdfStmp - b.mdfStmp,
        responsive: ["xxl"],
        align: "center"
    },
    {
        title: "Orgnization",
        dataIndex: "orgNm",
        searchable: true,
        align: "center"
    },
    {
        title: "Ship By",
        dataIndex: "shipBy",
        searchable: true,
        responsive: ["xxl"],
        align: "center"
    },
    {
        title: "status",
        dataIndex: "status",
        searchable: true,
        responsive: ["xxl"],
        align: "center"
    }
]

export const searchReceivedShipmentColumns: SearchableColumnsType<ShipmentDocument> = [

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
    },
    {
        title: "Executor",
        dataIndex: "usrID"
    }
]

export const searchLocationInventoryColumns: SearchableColumnsType<ShipmentDocument> = [

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
interface SellerInventoryDocument {
    upc: string;
    org: string;
    qty: number;
    mdfStmp: number;
    crtStmp: number;
}
export const searchSellerInventoryColumns: SearchableColumnsType<SellerInventoryDocument> = [
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