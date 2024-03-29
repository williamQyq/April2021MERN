import { Row, Col, Divider, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;


const KeyStat: React.FC = () => {
    return (
        <div className='card'>
            <Row>
                <Title level={4}>Key Statistics</Title>
                <Divider />
                <Col className="key-stat-col">
                    <Row><Title level={5}>24 Week Low</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
                <Col className="key-stat-col">
                    <Row><Title level={5}>24 Week High</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
                <Col className="key-stat-col">
                    <Row><Title level={5}>Sold Speed Ratio</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
            </Row>
            <Row>
                <Title level={4}>WMS Statistics</Title>
                <Divider />
                <Col className="key-stat-col">
                    <Row><Title level={5}>Today Sold</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
                <Col className="key-stat-col">
                    <Row><Title level={5}>Week Sold</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
                <Col className="key-stat-col">
                    <Row><Title level={5}>Total Sold</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
                <Col className="key-stat-col">
                    <Row><Title level={5}>Quantity-Now</Title></Row>
                    <Row><Text>-</Text></Row>
                </Col>
            </Row>
        </div>
    );
}

export default KeyStat;