import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import FormTable from "component/utility/FormTable.jsx";
import { defaultSettings, needToShipColumns } from "component/Warehouse/utilities.js";
import { getShippedNotVerifiedShipmentByDate } from "reducers/actions/outboundActions";
import moment from "moment";
import { Button, Table, Typography } from "antd";
import { confirmShipmentAndSubTractQty } from "reducers/actions/outboundActions.js";

const { Text } = Typography;

const NeedToShipTable = (props) => {
    const { data, loading, pendingShipmentInfo } = props;
    const dispatch = useDispatch();
    const [allSelected, setAllSelected] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowkeys] = useState([]);

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
    useEffect(() => {
        let today = getUnixDate(0);
        // console.log(`today date in unix: `, today)
        let tommorrow = getUnixDate(1);
        dispatch(getShippedNotVerifiedShipmentByDate([today, tommorrow]))//get unsubstantiated shipment from today to tomorrow excluded

        let hasRowData = data.length > 0 ? true : false;
        let isAllRowsSelected = selectedRowKeys.length >= data.length ? true : false;
        if (isAllRowsSelected && hasRowData) {
            setAllSelected(true)
        } else {
            setAllSelected(false)
        }


    }, [selectedRowKeys, allSelected, data.length, dispatch])

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
            let dataRowKeys = data.map((shipment) => shipment.trackingID)
            setSelectedRowkeys(dataRowKeys)
            setSelectedRows(data)

        }
        setAllSelected(!allSelected);
    }

    const selectedCount = selectedRows.length;
    let hasPendingShipment = pendingShipmentInfo.pending > 0 ? true : false;
    return (
        <div style={{
            padding: "4px 8px",
            boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.8)"
        }}>
            <FormTable
                loading={loading}
                data={data}
                columns={needToShipColumns}
                tableSettings={{
                    ...defaultSettings,
                    rowKey: "trackingID",
                    rowSelection: { ...rowSelection },
                    title: () =>
                        <>
                            <Button
                                style={{ marginRight: "8px" }}
                                type={allSelected ? "danger" : "primary"}
                                onClick={() => toggleSelectAll()}
                            >
                                {
                                    (allSelected ? `Unselected All Shipment` : `Select All Shipment`)
                                }
                            </Button>
                            <Button
                                style={{ marginRight: "8px" }}
                                type="primary"
                                onClick={() => handleShipmentConfirmClick()}
                            >
                                {
                                    (selectedCount > 0 ? `Confirm ${selectedCount} Selected Shipment` :
                                        `Confirm Shipment`)
                                }
                            </Button>
                            <Text type={hasPendingShipment > 0 ? "danger" : "success"}> {hasPendingShipment > 0 ? `Awaiting ${pendingShipmentInfo.pending} Shipment...` : "All unsubstantiated shipment loaded!"}</Text>
                        </>
                }}
            />
        </div >
    )
}

export default NeedToShipTable;