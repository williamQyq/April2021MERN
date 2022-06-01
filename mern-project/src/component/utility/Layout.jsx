import { Typography, Row, Col } from "antd";

const { Text, Title } = Typography;

export const ContentHeader = ({ title }) => (
    <Title level={4}>{title}</Title>
);

export const SubContentHeader = ({ title }) => {
    return (
        <>
            <Row gutter={16} style={{ alignItems: 'center' }}>
                <Col>
                    <Title level={4}>{title}</Title>
                </Col>
            </Row>
            {/* <Divider /> */}
        </>
    );
}
