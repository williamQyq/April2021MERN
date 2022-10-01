import { Row, Col, Progress, Typography } from 'antd';
import { useMemo } from 'react';
const { Text } = Typography;


const ShipmentStatusBoard = (props) => {
    const { pending, total } = props.shipmentInfo;

    const getFinishedPercent = (pending, total) => {
        console.log(typeof (pending), pending);
        //if no shipment today
        if (total <= 0) {
            return 0;
        }

        return (
            Math.round(((total - pending) / total).toFixed(2) * 100)
        )
    }
    const finishedPercent = useMemo(() => getFinishedPercent(pending, total), [pending, total]);

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