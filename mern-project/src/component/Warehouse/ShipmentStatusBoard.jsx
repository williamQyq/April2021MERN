import { Row, Col, Progress, Typography } from 'antd';
import { useMemo } from 'react';
const { Text } = Typography;


const ShipmentStatusBoard = ({ shipmentInfo }) => {
    const { pending, total, pickUpPending, pickUpCreated } = shipmentInfo;
    const getFinishedPercent = (nume, denom) => {
        //if no shipment today
        if (denom === undefined || denom <= 0) {
            return 0;
        }

        return Math.round(((denom - nume ) / denom).toFixed(2) * 100)

    }
    const shipmentFulfilledPercentByToday = useMemo(() => getFinishedPercent(pending, total), [pending, total]);
    const pickUpCreatedPercent = useMemo(() => getFinishedPercent(pickUpPending, pickUpCreated), [pickUpPending, pickUpCreated]);

    return (
        <>
            <Row gutter={[8, 8]} justify="start">
                <Col span={6}><Progress showInfo={false} percent={shipmentFulfilledPercentByToday}></Progress></Col>
                <Col >
                    <Text strong={true} italic={true}>
                        {
                            `Today: ${pending > 0 ? pending : 0} pending - ${total > 0 ? total : 0} total`
                        }
                    </Text>
                </Col>
            </Row >
            <Row gutter={[8, 8]} justify="start">
                <Col span={6}><Progress showInfo={false} percent={pickUpCreatedPercent}></Progress></Col>
                <Col >
                    <Text strong={true} italic={true}>
                        {
                            `${pickUpPending > 0 ? pickUpPending : 0} pending Pick Up Label`
                        }
                    </Text>
                </Col>
            </Row >
        </>
    )
}

export default ShipmentStatusBoard;