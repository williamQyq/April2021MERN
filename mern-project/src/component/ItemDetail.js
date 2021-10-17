import React from 'react';
import { useLocation } from 'react-router-dom';
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Layout, Row, Col, Divider, Typography, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { Content, Sider } = Layout;
const antIcon = <SyncOutlined spin />;


const ItemDetail = () => {


    return (

        <Row className="main-grid">

            <LeftPanel />
            <SideBarControl />

        </Row>


    );
}
const LeftPanel = () => {

    const location = useLocation()
    const { item } = location.state;
    console.log(item);

    const getPriceDiffPercentage = () => {
        let percentage = (item.priceDiff / item.currentPrice) * 100;
        return parseFloat(percentage).toFixed(2);
    }

    return (
        <Col flex="1 0 66.6666666667%" className="left-panel">
            <Row><Title level={4}>{item.name}</Title></Row>
            <Row className="price-row">
                <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />

            </Row>
            <Row className="price-row-nd"><Title level={5}>${item.priceDiff} ({getPriceDiffPercentage()}%) Today</Title></Row>
            <Row><PriceHistoryChart /></Row>
            <Row>
                <Title level={3}>Key Statistics</Title>
                <Divider />

            </Row>
        </Col>
    );
}

const PriceHistoryChart = () => {
    return (
        <Text>Chart</Text>
    );
}


const SideBarControl = () => {
    return (
        <Col flex="1 0 27.7777777778%" className="right-panel">
            <Text>sidebar</Text>
        </Col>
    );
}


export default ItemDetail;

