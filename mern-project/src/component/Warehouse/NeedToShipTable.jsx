import moment from "moment";
import { Table } from "antd";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormTable from "@src/component/utils/FormTable";
import { defaultSettings, needToShipColumns } from "@src/component/Warehouse/util";
import { getShippedNotVerifiedShipmentByDate } from "@redux-action//outboundActions.js";
import { confirmShipmentAndSubTractQty } from "@redux-action//outboundActions.js";
import NeedToShipTableTitle from "./NeedToShipTableTitle.jsx";


const NeedToShipTable = (props) => {
    const { shippedNotVerifiedItems, itemsLoading } = useSelector((state) => (state.warehouse.needToShip));
    const { shipmentInfo } = props;
    const dispatch = useDispatch();
    const [allSelected, setAllSelected] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowkeys] = useState([]);

    const getNotVerifiedShipment = useCallback(() => {
        const today = getUnixDate(0);
        const tommorrow = getUnixDate(1);
        dispatch(getShippedNotVerifiedShipmentByDate([today, tommorrow]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getNotVerifiedShipment();
    }, [getNotVerifiedShipment])

    useEffect(() => {
        let hasRowData = shippedNotVerifiedItems.length > 0 ? true : false;
        let isAllRowsSelected = selectedRowKeys.length >= shippedNotVerifiedItems.length ? true : false;
        if (isAllRowsSelected && hasRowData) {
            setAllSelected(true)
        } else {
            setAllSelected(false)
        }

    }, [selectedRowKeys, allSelected, shippedNotVerifiedItems])


    const rowSelection = {
        fixed: true,
        selectedRowKeys,
        onChange: (newSelectedRowKeys, newSelectedRows) => {
            setSelectedRows(newSelectedRows);
            setSelectedRowkeys(newSelectedRowKeys);
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_NONE
        ],
        columnWidth: 60
    }
    const getUnixDate = (offset) => {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        return moment(date).format('x');
    }
    const handleShipmentConfirmClick = () => {
        setSelectedRowkeys([]);
        setSelectedRows([]);
        //add unshipment rcIts property, array of [upc, qty], to unshipment from selectedRows
        let selectedShipment = selectedRows.map((row) => {
            let rcIts = []
            let unshipment = { ...row };

            for (const property in row) {
                if (property.match(/^upc\d+$/g)) {
                    rcIts.push([row[property], row[`${property}Qty`]])
                    delete unshipment[property]
                    delete unshipment[`${property}Qty`]
                }
            }

            return { ...unshipment, rcIts };
        })

        //update sellerInv and locationInv then get shipment data 
        dispatch(confirmShipmentAndSubTractQty(selectedShipment)).then(() => {
            let today = getUnixDate(0);
            let tommorrow = getUnixDate(1);
            dispatch(getShippedNotVerifiedShipmentByDate([today, tommorrow]))
        })
    }
    const toggleSelectAll = () => {
        // if all roww selected, deselect all, vice versa.
        if (allSelected) {
            setSelectedRowkeys([]);
            setSelectedRows([]);
        } else {
            let dataRowKeys = shippedNotVerifiedItems.map((shipment) => shipment.trackingID)
            setSelectedRowkeys(dataRowKeys)
            setSelectedRows(shippedNotVerifiedItems)

        }
        setAllSelected(!allSelected);
    }

    const selectedCount = selectedRows.length;

    const titleHandler = {
        handleShipmentConfirmClick,
        toggleSelectAll,
        allSelected,
        selectedCount,
        shipmentInfo
    }
    return (
        <div style={{
            borderRadius: "4px",
            padding: "4px 8px",
            boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.8)"
        }}>
            <FormTable
                loading={itemsLoading}
                data={shippedNotVerifiedItems}
                columns={needToShipColumns}
                tableSettings={{
                    ...defaultSettings,
                    rowKey: "trackingID",
                    rowSelection: { ...rowSelection },
                    title: () => <NeedToShipTableTitle {...titleHandler} />

                }}
            />
        </div >
    )
}

export default NeedToShipTable;