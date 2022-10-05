import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, Skeleton } from 'antd';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getNeedToShipFromShipmentWithLimit,
} from 'reducers/actions/outboundActions.js';

const AwaitingShipmentList = ({ shipmentInfo }) => {
    const { pending, total } = shipmentInfo;
    const dispatch = useDispatch();
    const { items, itemsLoading } = useSelector((state) => state.warehouse.needToShip);

    const [initLoading, setInitLoading] = useState(true);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);

    const docLimits = 5;

    const updateItems = useCallback(() => {
        dispatch(getNeedToShipFromShipmentWithLimit(docLimits, skip))
        setSkip(skip + docLimits)
        if (initLoading === true)
            setInitLoading(false);
    }, [dispatch, docLimits, skip, initLoading])

    useEffect(() => {
        if (skip === 0) {
            updateItems();
        }
        setData([...data, ...items])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateItems, skip, items])



    const loadMore = () => {
        if (initLoading || itemsLoading) {
            return;
        }
        updateItems();
    }

    return (
        <div style={{ maxWidth: "80%", margin: "auto" }}>
            <ShipmentStatusBoard shipmentInfo={{ pending, total }} />
            <div
                id='scrollableDiv'
                style={{
                    height: "100vh",
                    overflow: "auto",
                    background: "linear-gradient(145deg, #e2e2e4, #ffffff)",
                    boxShadow: "5px 5px 10px #9c9c9d"
                }}
            >
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={data.length !== 0 && data.length < pending}
                    loader={
                        <Skeleton
                            paragraph={{
                                rows: 1,
                            }}
                            active
                        />
                    }
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"

                >
                    <List
                        dataSource={data}
                        size="small"
                        renderItem={(item) => (
                            <List.Item>
                                <DescriptionCard detail={item} />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default AwaitingShipmentList;