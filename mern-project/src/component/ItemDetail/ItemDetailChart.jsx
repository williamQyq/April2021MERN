import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { setChartConfig, setChartData, setColorOnPriceUpOrDrop, setDataPoints, setLabels } from 'component/ItemDetail/ChartUtilities.js';


const PriceHistoryChart = () => {
    const { price_timestamps, priceDiff } = useSelector((state) => state.item.itemDetail);
    const labels = setLabels(price_timestamps);
    const datapoints = setDataPoints(price_timestamps);
    const borderColor = setColorOnPriceUpOrDrop(priceDiff);

    const data = setChartData(labels, datapoints, borderColor);
    const config = setChartConfig(data);

    useEffect(() => {
        let myChart = new Chart('chart', config)
        return () => myChart.destroy();
    }, [])

    return (
        <canvas id='chart' width={"900px"} />
    );
}

export default PriceHistoryChart;
