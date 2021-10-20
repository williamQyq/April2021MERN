import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Divider, Typography, Spin } from 'antd';
import PriceHistoryChart from './ItemDetailChart.js';
import { SyncOutlined } from '@ant-design/icons';

import { getItemDetail } from '../reducers/actions/itemBBActions.js';
import PropTypes from 'prop-types';

const { Text, Title } = Typography;
const antIcon = <SyncOutlined spin />;

class LeftPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: props.itemId,
            item: props.itemBB.itemDetail
        }
    }

    componentDidMount() {
        this.props.getItemDetail(this.state.itemId);
    }

    getPriceDiffPercentage = (item) => {
        let percentage = 0;

        if (item.priceDiff != null) {
            percentage = (item.priceDiff / item.currentPrice) * 100;
        }

        return parseFloat(percentage).toFixed(2);
    }

    render() {
        const item = this.props.itemBB.itemDetail;
        if (item != null) {
            return (
                <Col flex="1 0 66.6666666667%" className="left-panel" >
                    <Row><Title level={4}>{item.name}</Title></Row>
                    <Row className="price-row">
                        <Title level={5} className="price-row-price">${item.currentPrice}</Title>
                        <Spin indicator={antIcon} style={{ fontSize: 0, color: 'black' }} />
                    </Row>
                    <Row className="price-row-nd"><Title level={5}>${item.priceDiff} ({this.getPriceDiffPercentage(item)}%) Today</Title></Row>
                    <Row className="chart-row"><PriceHistoryChart item={item} /></Row>
                    <Divider />
                    <Row>
                        <Title level={3}>Key Statistics</Title>
                        <Divider />

                    </Row>
                </Col>
            )
        } else {
            return null;
        }
    }
}


LeftPanel.prototypes = {
    // location: PropTypes.object.isRequired,
    getItemDetail: PropTypes.func.isRequired,
    itemBB: PropTypes.object.isRequired,

    // bb_item: PropTypes.object.isRequired,
}

//state contains reducers
const mapStateToProps = (state) => ({ itemBB: state.itemBB });

export default connect(mapStateToProps, { getItemDetail })(LeftPanel);