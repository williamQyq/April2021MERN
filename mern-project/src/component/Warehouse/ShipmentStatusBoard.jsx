import { Row, Col, Progress, Typography } from 'antd';
const { Text } = Typography;

const ShipmentStatusBoard = (props) => {
    const { pending, total } = props.shipmentInfo;

    const getFinishedPercent = (pendingCount, totalCount) => {
        //if no shipment today
        if (totalCount <= 0) {
            return 0;
        }
        //if no pending
        if (pendingCount === 0) {
            return 100;
        }

        return (
            Math.round(((totalCount - pendingCount) / totalCount).toFixed(2) * 100)
        )
    }

    const finishedPercent = getFinishedPercent(pending, total);
    return (
        <Row gutter={[8, 8]} justify="end">
            <Col flex={6}></Col>
            <Col flex={2}><Progress showInfo={false} percent={finishedPercent}></Progress></Col>
            <Col >
                <Text strong={true} italic={true}>
                    {
                        `${pending > 0 ? pending : 0} pending - ${total > 0 ? total : 0} total`
                    }
                </Text>
            </Col>
        </Row >
    )
}

export default ShipmentStatusBoard;