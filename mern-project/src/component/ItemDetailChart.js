import UTILS from '../styles/Util.js';
import { Line } from 'react-chartjs-2';

const PriceHistoryChart = (props) => {
    const priceTimeStamps = props.item.price_timestamps;

    const labels = setLabels(priceTimeStamps);
    const datapoints = setDataPoints(priceTimeStamps);
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'BB Price History',
                data: datapoints,
                borderColor: UTILS.COLORS_RGB.BLACK,
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
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
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
                    suggestedMin: 200,
                    suggestedMax: 1500,
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

export default PriceHistoryChart;