import React from 'react';
import { Line } from 'react-chartjs-2';
import { Divider, Row } from 'antd';
import ChartMenu from 'component/ItemDetailChartMenu.js';
import { useSelector } from 'react-redux';
import { setChartConfig, setChartData, setColorOnPriceUpOrDrop, setDataPoints, setLabels } from 'utilities/chartUtilities';

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
        <Row className="chart-row">
            <Line
                data={config.data}
                options={config.options} />
            <Divider dashed={true} />
            <ChartMenu />
            <Divider />
        </Row>

    );
}

export default PriceHistoryChart;
