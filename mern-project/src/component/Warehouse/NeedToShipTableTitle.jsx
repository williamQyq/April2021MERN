import { Button, Typography } from "antd";
import { useSelector } from "react-redux";
const { Text } = Typography;

const NeedToShipTableTitle = (props) => {
    const {
        handleShipmentConfirmClick,
        toggleSelectAll,
        allSelected,
        selectedCount,
        shipmentInfo,
    } = props;

    const { confirmLoading } = useSelector(state => state.warehouse.needToShip);

    let hasPendingShipment = shipmentInfo.pending > 0 ? true : false;
    let titleType = hasPendingShipment ? "danger" : "success";

    return (
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
                loading={confirmLoading}
                style={{ marginRight: "8px" }}
                type="primary"
                onClick={() => handleShipmentConfirmClick()}
            >
                {
                    (selectedCount > 0 ? `Confirm ${selectedCount} Selected Shipment` :
                        `Confirm Shipment`)
                }
            </Button>
            <Text
                style={{ paddingLeft: "4px" }}
                strong={true}
                type={titleType}
            >
                {
                    hasPendingShipment > 0 ?
                        `Awaiting ${shipmentInfo.pending} Shipment...` :
                        "All unsubstantiated shipment loaded!"
                }
            </Text>
            
            {
            // confirm: today mdftm confirm shipment but contains day before.
            /* <Text
                style={{ paddingLeft: "4px" }}
                strong={true}
                type="success"
            >
                {
                    shipmentInfo.confirm ? `Confirmed ${shipmentInfo.confirm} Shipment Today!` : null
                }
            </Text> */}
        </>
    );
}

export default NeedToShipTableTitle;