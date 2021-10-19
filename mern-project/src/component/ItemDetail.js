import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Divider, Typography, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getItemDetail } from '../reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import PriceHistoryChart from './ItemDetailChart';

const { Text, Title } = Typography;
const antIcon = <SyncOutlined spin />;

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: this.props.location.state.itemId
        };
    }

    componentDidMount() {
        // console.log(`*** ${this.state.itemId}`);
        this.props.getItemDetail(this.state.itemId);
    }

    render() {
        const itemDetail = this.props.itemDetail.itemDetail;
        // console.log(`***\n${JSON.stringify(itemDetail)}`)
        return (
            <Row className="main-grid">
                <LeftPanel item={itemDetail} />
                <SidePanel />
            </Row>
        );
    }

}

const LeftPanel = (props) => {
    const item = props.item;

    const getPriceDiffPercentage = () => {
        let percentage = 0;
        
        if(item.priceDiff != null){
            percentage = (item.priceDiff / item.currentPrice) * 100;
        }
        
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
            <Row className="chart-row"><PriceHistoryChart priceHistory={item.price_timestamps} /></Row>
            <Divider />
            <Row>
                <Title level={3}>Key Statistics</Title>
                <Divider />

            </Row>
        </Col>
    );
}

const SidePanel = () => {
    return (
        <Col flex="1 0 27.7777777778%" className="right-panel">
            <Text>sidebar</Text>
        </Col>
    );
}

ItemDetail.prototypes = {
    location: PropTypes.object.isRequired,
    getItemDetail: PropTypes.func.isRequired,
    itemDetail: PropTypes.object.isRequired,

    // bb_item: PropTypes.object.isRequired,
}

//state contains reducers
const mapStateToProps = (state) => {
    return ({ itemDetail: state.itemDetail })
}

export default withRouter(connect(mapStateToProps, { getItemDetail })(ItemDetail));
