import React from 'react';
import UTILS from 'styles/Util.js';
import { Line } from 'react-chartjs-2';
import { Divider, Row, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ChartMenu from 'component/ItemDetail/ItemDetailChartMenu.js';
import { getKeepaStat } from 'reducers/actions/keepaActions';

const { Title } = Typography;
const { Search } = Input;

class KeepaStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleSearch = (value, e) => {
        this.props.getKeepaStat(value);
    }

    //set price chart labels
    setLabels = (priceTimeStamps) => {

        let labels = [];
        const first_ts = priceTimeStamps[0];
        labels = priceTimeStamps.map(ts => {
            return ts.date;
        })
        labels.unshift(first_ts.date)   //double insert first element of timestamps, make it a line.
        return labels;
    }
    //set price chart datapoints
    setDataPoints = (priceTimeStamps) => {

        let datapoints = [];
        const first_ts = priceTimeStamps[0];

        datapoints = priceTimeStamps.map(ts => {
            return ts.price;
        })
        datapoints.unshift(first_ts.price); //double insert first element of timestamps, make it a line.
        return datapoints;
    }
    //set price chart line color
    setBorderColor = (priceDiff) => {
        let borderColor = UTILS.COLORS_RGB.BLACK;

        if (priceDiff > 0) {
            borderColor = UTILS.COLORS_RGB.RED
        } else if (priceDiff < 0) {
            borderColor = UTILS.COLORS_RGB.GREEN
        }
        return borderColor;
    }

    render() {

        const { price_timestamps, priceDiff } = this.props.itemDetail;

        const labels = this.setLabels(price_timestamps);
        const datapoints = this.setDataPoints(price_timestamps);
        const borderColor = this.setBorderColor(priceDiff);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: '$',
                    data: datapoints,
                    borderColor: borderColor,
                    fill: false,
                    tension: 0.4
                }
                // , {
                //     label: 'History',
                //     data: datapoints,
                //     borderColor: UTILS.COLORS.BLACK,
                //     fill: false
                // }
            ]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                        text: 'Chart.js Line Chart - Cubic interpolation mode'
                    },
                    legend: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: false,
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        suggestedMin: 200,
                        suggestedMax: 1500,
                        grid: {
                            display: false
                        }
                    }
                }
            },
        };


        return (
            <>
                <Title level={4}> Keepa Search </Title>
                <Divider />
                <Search
                    size='large'
                    placeholder="Enter Search Content"
                    prefix={<SearchOutlined />}
                    loading={this.props.loading}
                    onSearch={this.handleSearch}
                />
                {/* <Line
                    data={config.data}
                    options={config.options} /> */}
                <Divider dashed={true} />
                <ChartMenu />
                <Divider />
            </>
        );
    }

}

KeepaStat.prototypes = {
    itemDetail: PropTypes.object.isRequired,
    getKeepaStat: PropTypes.func.isRequired,
    keepa: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    itemDetail: state.item.itemDetail,
    keepa: state.keepa.keepa,
    loading: state.keepa.loading
});

export default connect(mapStateToProps, { getKeepaStat })(KeepaStat);