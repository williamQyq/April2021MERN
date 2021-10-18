import React from 'react';
import { useLocation } from 'react-router-dom';
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Layout, Row, Col, Divider, Typography, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import UTILS from '../styles/Util.js';
import { connect } from 'react-redux';
import { getItemDetail } from '../reducers/actions/itemBBActions';
import PropTypes from 'prop-types';

const { Text, Title } = Typography;
const { Content, Sider } = Layout;
const antIcon = <SyncOutlined spin />;


const ItemDetail = (props) => {
    const location = useLocation()
    const { item } = location.state;
    console.log(`props:\n${JSON.stringify(props)}`);
    // props.getItemDetail(item._id);
    return (

        <Row className="main-grid">
            <LeftPanel item={item}/>
            <SideBarControl />

        </Row>


    );
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


const SideBarControl = () => {
    return (
        <Col flex="1 0 27.7777777778%" className="right-panel">
            <Text>sidebar</Text>
        </Col>
    );
}

ItemDetail.prototypes = {
    getItemDetail: PropTypes.func.isRequired,

    bb_item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    bb_item: state.bb_item
})


export default connect(mapStateToProps, {getItemDetail})(ItemDetail);

