import React from 'react';
import { Line } from 'react-chartjs-2';
import { Divider } from 'antd';
import ChartMenu from 'component/ItemDetail/ItemDetailChartMenu';
import { useSelector } from 'react-redux';
import { setChartConfig, setChartData, setColorOnPriceUpOrDrop, setDataPoints, setLabels } from 'component/ItemDetail/ChartUtilities';

const PriceHistoryChart = () => {
    const { price_timestamps, priceDiff } = useSelector((state) =>
        state.item.itemDetail
    );
    const labels = setLabels(price_timestamps);
    const datapoints = setDataPoints(price_timestamps);
    const borderColor = setColorOnPriceUpOrDrop(priceDiff);
    const data = setChartData(labels, datapoints, borderColor);
    const config = setChartConfig(data);

    return (
        <div className='chart'>
            <Line
                data={config.data}
                options={config.options} />
            <Divider dashed={true} />
            <ChartMenu />
        </div>
    );
}

export default PriceHistoryChart;
