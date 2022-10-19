import { Row, Progress, Typography } from 'antd';
import { useMemo } from 'react';
const { Text } = Typography;


const ShipmentStatusBoard = ({ shipmentInfo }) => {
    const { pending, total, pickUpPending, pickUpCreated } = shipmentInfo;
    const getFinishedPercent = (nume, denom) => {
        //if no shipment today
        if (denom === undefined || denom <= 0) {
            return 0;
        }

        return Math.round(((denom - nume) / denom).toFixed(2) * 100)

    }
    const shipmentFulfilledPercentByToday = useMemo(() => getFinishedPercent(pending, total), [pending, total]);
    const pickUpCreatedPercent = useMemo(() => getFinishedPercent(pickUpPending, pickUpCreated), [pickUpPending, pickUpCreated]);

    return (
        <>
            <Row >
                <Progress
                    style={{ width: 400, paddingRight: 20 }}
                    showInfo={false}
                    percent={shipmentFulfilledPercentByToday}
                />
                <Text strong={true} italic={true}>
                    {
                        `Today: ${pending > 0 ? pending : 0} pending - ${total > 0 ? total : 0} total`
                    }
                </Text>
            </Row >
            <Row >
                <Progress
                    style={{ width: 400, paddingRight: 20 }}
                    showInfo={false}
                    percent={pickUpCreatedPercent}
                />
                <Text strong={true} italic={true}>
                    {
                        `${pickUpPending > 0 ? pickUpPending : 0} pending Pick Up Label`
                    }
                </Text>
            </Row >
        </>
    )
}

export default ShipmentStatusBoard;