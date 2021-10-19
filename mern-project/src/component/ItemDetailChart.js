import UTILS from '../styles/Util.js';
import { Line } from 'react-chartjs-2';

const PriceHistoryChart = (props) => {
    // const { priceHistory } = props;
    
    // console.log(`*** ${JSON.stringify(priceHistory)}`)
    // const labels = priceHistory.map((ts) => {
    //     return ts.date;
    // })
    const DATA_COUNT = 12;
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

export default PriceHistoryChart;