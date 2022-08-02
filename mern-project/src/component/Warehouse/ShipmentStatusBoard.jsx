import { Row, Col, Progress, Typography } from 'antd';
const { Text } = Typography;

const ShipmentStatusBoard = (props) => {
    const { shipmentInfo } = props;
    const { pending, total } = shipmentInfo;
    const getPercent = (pendingCount, totalCount) => (
        ((totalCount - pendingCount) / totalCount).toFixed(2) * 100
    )
    let shipmentPercent = getPercent(pending, total);

    return (
        <Row gutter={[8, 8]} justify="end">
            <Col flex={6}></Col>
            <Col flex={2}><Progress percent={shipmentPercent}></Progress></Col>
            <Col ><Text italic={true}>{`${pending} pending - ${total} total`}</Text></Col>
        </Row >
    )
}

export default ShipmentStatusBoard;