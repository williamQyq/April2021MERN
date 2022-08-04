import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import FormTable from "component/utility/FormTable.jsx";
import { defaultSettings, needToShipColumns } from "component/Warehouse/utilities.js";
import { getShippedNotVerifiedShipmentByDate } from "reducers/actions/outboundActions";
import moment from "moment";
import { Button, Table } from "antd";
import { confirmShipmentAndSubTractQty } from "reducers/actions/outboundActions.js";

const NeedToShipTable = (props) => {
    const { data, loading } = props;
    const dispatch = useDispatch();
    const [allSelected, setAllSelected] = useState(false);
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowKeys, setSelectedRowkeys] = useState([])
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
        let tommorrow = getUnixDate(1);
        dispatch(getShippedNotVerifiedShipmentByDate([today, tommorrow]))//get unsubstantiated shipment from today to tomorrow excluded

        let hasRowData = data.length > 0 ? true : false;
        let isAllRowsSelected = selectedRowKeys.length >= data.length ? true : false;
        if (isAllRowsSelected && hasRowData) {
            setAllSelected(true)
        } else {
            setAllSelected(false)
        }
    }, [selectedRowKeys, allSelected])

    const getUnixDate = (offset) => {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        return moment(date).format('x');
    }
    const handleShipmentConfirmClick = () => {
        dispatch(confirmShipmentAndSubTractQty(selectedRows))
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
                                type="primary"
                                onClick={() => handleShipmentConfirmClick()}
                            >
                                {
                                    (selectedCount > 0 ? `Confirm ${selectedCount} Selected Shipment` :
                                        `Confirm Shipment`)
                                }
                            </Button>
                        </>
                }}
            />
        </div>
    )
}

export default NeedToShipTable;