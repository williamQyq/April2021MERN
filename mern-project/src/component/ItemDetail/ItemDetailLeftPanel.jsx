import React from 'react';
import { connect } from 'react-redux';
import { Row, Typography, Spin, Skeleton } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import KeyStatistics from 'component/ItemDetail/ItemDetailStat.js';
import PriceHistoryChart from 'component/ItemDetail/ItemDetailChart.jsx';
import KeepaStatistics from 'component/KeepaStatistics.js';
import { ContentHeader } from 'component/utility/Layout';

const { Title } = Typography;
const antIcon = <SyncOutlined spin />;

class LeftPanel extends React.Component {

    getPriceDiffPercentage = (item) => {
        let percentage = 0;

        if (item.priceDiff != null) {
            percentage = (item.priceDiff / item.currentPrice) * 100;
        }

        return parseFloat(percentage).toFixed(2);
    }

    render() {
        const item = this.props.itemDetail;
        return (
            <Skeleton loading={this.props.loading}>
                <ContentHeader title={item.name} />
                <Row className="price-row">
                    <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                    <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />
                </Row>
                <Title level={5}>${item.priceDiff} ({this.getPriceDiffPercentage(item)}%) Today</Title>
                <PriceHistoryChart />
                <KeyStatistics />
                <KeepaStatistics />
            </Skeleton>
        )
    }
}


LeftPanel.prototypes = {
    // location: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    itemDetail: PropTypes.object.isRequired
}

//state contains reducers
const mapStateToProps = (state) => ({
    loading: state.item.loading,
    itemDetail: state.item.itemDetail
});

export default connect(mapStateToProps, {})(LeftPanel);