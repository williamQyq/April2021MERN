import UTILS from "styles/Util"

export const setChartData = (labels, datapoints, borderColor) => {
    return ({

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
    })
}
export const setChartConfig = (data) => {
    return ({
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
    })
}

export function setLabels(priceTimeStamps) {
    let labels = [];
    labels = priceTimeStamps.map(ts => {
        return ts.date;
    })
    labels.unshift(priceTimeStamps[0].date)   //double insert first element of timestamps, make it a line.
    return labels;
}

//set price chart datapoints
export function setDataPoints(priceTimeStamps) {

    let datapoints = [];
    const first_ts = priceTimeStamps[0];

    datapoints = priceTimeStamps.map(ts => {
        return ts.price;
    })
    datapoints.unshift(first_ts.price); //double insert first element of timestamps, make it a line.
    return datapoints;
}

export function setColorOnPriceUpOrDrop(priceDiff) {
    let borderColor = UTILS.COLORS_RGB.BLACK;

    if (priceDiff > 0) {
        borderColor = UTILS.COLORS_RGB.RED
    } else if (priceDiff < 0) {
        borderColor = UTILS.COLORS_RGB.GREEN
    }
    return borderColor;
}