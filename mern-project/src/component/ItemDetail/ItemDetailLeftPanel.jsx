import React from 'react';
import { Row, Typography, Spin, Skeleton } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import KeyStatistics from 'component/ItemDetail/ItemDetailStat';
import PriceHistoryChart from 'component/ItemDetail/ItemDetailChart.jsx';
import { ContentHeader } from 'component/utility/Layout';

const { Title } = Typography;
const antIcon = <SyncOutlined spin />;

export default class LeftPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getPriceDiffPercentage = (item) => {
        let percentage = 0;

        if (item.priceDiff != null) {
            percentage = (item.priceDiff / item.currentPrice).toFixed(2) * 100;
        }

        return percentage
    }

    render() {
        const { item, loading } = this.props;
        let priceTS = item.price_timestamps;
        let priceDiff = item.priceDiff ? item.priceDiff.toFixed(2) : "Not Available";
        let latestUpdatedTime = priceTS.length > 0 ? priceTS[priceTS.length - 1].date : "Not Available";
        return (
            <Skeleton loading={loading}>
                <ContentHeader title={item.name} />
                <Row className="price-row">
                    <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                    <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />
                </Row>
                <Title level={5}>${priceDiff} ({this.getPriceDiffPercentage(item)}%)</Title>
                <Title level={5}>{latestUpdatedTime} - Latest</Title>
                <PriceHistoryChart />
                <KeyStatistics />
            </Skeleton>
        )
    }
}
