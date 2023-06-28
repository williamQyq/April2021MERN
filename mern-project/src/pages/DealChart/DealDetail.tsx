import React, { useEffect, useMemo } from 'react';
import './ItemDetail.scss';
import { Col, Row, Skeleton, Typography, Spin } from 'antd';
// import OrderPanel from './ItemDetailOrderCard.jsx';
import { DealDataType, getDealDetail } from '@redux-action/deal.action';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux/interface.js';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store/store';
import { ContentHeader } from '@src/component/utils/Layout';
import PriceHistoryChart from './DealPriceChart';
import { SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DealDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dealData, loading }: { dealData?: DealDataType, loading: boolean } = useSelector((state: RootState) => state.item);
    const { storeId, dealId } = useParams();
    useEffect(() => {
        let abortController = new AbortController();
        if (storeId && dealId)
            dispatch(getDealDetail(storeId, dealId, abortController.signal));

        return () => {
            abortController.abort();
        }
    }, [dealId]);

    // @description the ratio of changed price.
    const getPriceDelta = (deal?: DealDataType): number => {
        let delta: number = deal?.priceDiff ? Number(((deal.priceDiff / deal.currentPrice) * 100).toFixed(2)) : 0;
        return delta;
    }

    const discount: number = useMemo(() =>
        dealData?.priceDiff ? Number(dealData.priceDiff.toFixed(2)) : 0

        , [dealData]);

    const priceDelta: number = useMemo(() =>
        getPriceDelta(dealData)
        , [dealData]);

    const latestRecordTime: string = useMemo(() => {
        if (dealData?.price_timestamps) {
            let ts = dealData.price_timestamps;
            return ts.length > 0 ? ts[ts.length - 1].date.toString() : "Not Available";
        }
        return "Not Available";
    }, [dealData])

    //product name, product latest price
    const { name, currentPrice } = dealData || {};
    return (
        <Skeleton loading={loading} active>
            {name && (
                <Row gutter={[24, 24]} style={{ "display": "flex", "justifyContent": "center" }} >
                    <Col span={18} >
                        <ContentHeader title={name} />
                        <Col style={{marginLeft:16}}>
                            <Row >
                                <Title level={5} className="price-row-price">${currentPrice}</Title>
                                <Spin indicator={<SyncOutlined spin />} style={{ fontSize: 0, color: 'black' }} />
                            </Row>
                            <Title level={5}>${discount} | {priceDelta}%</Title>
                            <Title level={5}>Last Record Time: {latestRecordTime}</Title>
                        </Col>
                        <PriceHistoryChart dealData={dealData} discount={discount} />
                    </Col>
                </Row>
            )}
        </Skeleton>
    )

}



export default DealDetail;
