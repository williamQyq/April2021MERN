import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Typography, Spin, Skeleton } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import 'styles/itemDetail.scss';
import PropTypes from 'prop-types';
import { getItemDetail } from 'reducers/actions/itemActions.js';
import KeyStatistics from 'component/ItemDetailStat.js';
import PriceHistoryChart from 'component/ItemDetailChart.js';
import KeepaStatistics from 'component/KeepaStatistics.js';

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
            <Col flex="1 0 66.6666666667%" className="left-panel" >
                <Skeleton loading={this.props.loading}>
                    <Row><Title level={4}>{item.name}</Title></Row>
                    <Row className="price-row">
                        <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                        <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />
                    </Row>
                    <Row ><Title level={5}>${item.priceDiff} ({this.getPriceDiffPercentage(item)}%) Today</Title></Row>
                    <PriceHistoryChart />
                    <KeyStatistics />
                    <KeepaStatistics />
                </Skeleton>
            </Col>
        )
    }
}


LeftPanel.prototypes = {
    // location: PropTypes.object.isRequired,
    getItemDetail: PropTypes.func.isRequired,
    itemBB: PropTypes.object.isRequired,

    // bb_item: PropTypes.object.isRequired,
}

//state contains reducers
const mapStateToProps = (state) => ({
    loading: state.item.loading,
    itemDetail: state.item.itemDetail
});

export default connect(mapStateToProps, { getItemDetail })(LeftPanel);