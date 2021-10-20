import React from 'react';
import UTILS from '../styles/Util.js';
import { Line } from 'react-chartjs-2';
import { BorderRightOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import ChartMenu from './ItemDetailChartMenu.js';

const PriceHistoryChart = (props) => {
    const { price_timestamps, priceDiff } = props.item;

    const labels = setLabels(price_timestamps);
    const datapoints = setDataPoints(price_timestamps);
    const borderColor = setBorderColor(priceDiff);

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
        <React.Fragment>
            <Line
                data={config.data}
                options={config.options} />
            <Divider dashed={true} />
                <ChartMenu/>
            <Divider />
        </React.Fragment>

    );
}
//set price chart labels
function setLabels(priceTimeStamps) {

    let labels = [];
    const first_ts = priceTimeStamps[0];
    labels = priceTimeStamps.map(ts => {
        return ts.date;
    })
    labels.unshift(first_ts.date)   //double insert first element of timestamps, make it a line.
    return labels;
}
//set price chart datapoints
function setDataPoints(priceTimeStamps) {

    let datapoints = [];
    const first_ts = priceTimeStamps[0];

    datapoints = priceTimeStamps.map(ts => {
        return ts.price;
    })
    datapoints.unshift(first_ts.price); //double insert first element of timestamps, make it a line.
    return datapoints;
}

function setBorderColor(priceDiff) {
    let borderColor = UTILS.COLORS_RGB.BLACK;

    if (priceDiff > 0) {
        borderColor = UTILS.COLORS_RGB.RED
    } else if (priceDiff < 0) {
        borderColor = UTILS.COLORS_RGB.GREEN
    }
    return borderColor;
}
export default PriceHistoryChart;