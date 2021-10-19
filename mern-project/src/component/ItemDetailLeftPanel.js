import React from 'react';
import { Row, Col, Divider, Typography, Spin } from 'antd';
import PriceHistoryChart from './ItemDetailChart.js';
import { SyncOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const antIcon = <SyncOutlined spin />;

const LeftPanel = (props) => {

    const { item } = props;
    return (
        <Col flex="1 0 66.6666666667%" className="left-panel" >
            <Row><Title level={4}>{item.name}</Title></Row>
            <Row className="price-row">
                <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />

            </Row>
            <Row className="price-row-nd"><Title level={5}>${item.priceDiff} ({getPriceDiffPercentage(item)}%) Today</Title></Row>
            <Row className="chart-row"><PriceHistoryChart priceHistory={item.price_timestamps} /></Row>
            <Divider />
            <Row>
                <Title level={3}>Key Statistics</Title>
                <Divider />

            </Row>
        </Col>
    );
}

const getPriceDiffPercentage = (item) => {
    let percentage = 0;

    if (item.priceDiff != null) {
        percentage = (item.priceDiff / item.currentPrice) * 100;
    }

    return parseFloat(percentage).toFixed(2);
}

export default LeftPanel;