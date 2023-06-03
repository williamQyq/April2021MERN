import React, { useEffect } from 'react';
import './ItemDetail.scss';
import { Col, Row, Skeleton } from 'antd';
import LeftPanel from './ItemDetailLeftPanel.jsx'
import OrderPanel from './ItemDetailOrderCard.jsx';
import { getDealDetail } from '@redux-action/deal.action';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux/interface.js';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store/store';


const DealDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dealData, loading } = useSelector((state: RootState) => state.item);
    const { store, id, } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        let abortController = new AbortController();
        if (store && id)
            dispatch(getDealDetail(store, id, abortController.signal));

        return () => {
            abortController.abort();
        }
    }, []);


    const goBack = () => {
        navigate(-1);
    }

    return (
        <Skeleton loading={loading} >
            <Row style={{ "display": "flex", "justifyContent": "center" }} gutter={[48, 24]}>
                <Col span={12} className="left-panel" >
                    <LeftPanel item={dealData} loading={loading} />
                </Col>
                <Col span={6} className="right-panel">
                    <OrderPanel />
                </Col>
            </Row>
        </Skeleton>
        // <div>Prices Detail</div>
    )

}



export default DealDetail;
