import React from 'react';
import { useLocation, withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Divider, Typography, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import UTILS from '../styles/Util.js';
import { connect } from 'react-redux';
import { getItemDetail } from '../reducers/actions/itemBBActions';
import PropTypes from 'prop-types';

const { Text, Title } = Typography;
const antIcon = <SyncOutlined spin />;

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.location.state.item
        };
    }

    componentDidMount() {
        // console.log(this.state.item._id)
        // this.props.getItemDetail(this.state.item._id);
    }

    render() {
        const { item } = this.state;
        return (
            <Row className="main-grid">
                {console.log(item)}
                <LeftPanel item={item} />
                <SidePanel />
            </Row>
        );
    }

}

const LeftPanel = (props) => {
    const item = props.item;

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
            <Row className="chart-row"><PriceHistoryChart /></Row>
            <Divider />
            <Row>
                <Title level={3}>Key Statistics</Title>
                <Divider />

            </Row>
        </Col>
    );
}

const PriceHistoryChart = () => {
    const DATA_COUNT = 24;
    const labels = [];
    for (let i = 0; i < DATA_COUNT; ++i) {
        labels.push(i.toString());
    }
    const datapoints = [0, 20, 20, 60, 60, 120, 0, 20, 20, 60, 1, 60, 0, 20, 20, 60, 60, 120];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Profit History',
                data: datapoints,
                borderColor: UTILS.COLORS.BLACK,
                fill: false,
                tension: 0.4
            }, {
                label: 'History',
                data: datapoints,
                borderColor: UTILS.COLORS.BLACK,
                fill: false
            }
        ]
    };
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            // maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: 'Chart.js Line Chart - Cubic interpolation mode'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {

                    display: false,
                    title: {
                        display: true
                    }
                },
                y: {
                    display: false,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    suggestedMin: -10,
                    suggestedMax: 200
                }
            }
        },
    };

    return (
        <Line
            data={config.data}
            options={config.options} />
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
