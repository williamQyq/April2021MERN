import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, Skeleton } from 'antd';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getNeedToShipFromShipmentWithLimit
} from 'reducers/actions/outboundActions.js';

const AwaitingShipmentList = ({ shipmentInfo }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const { pendingPickUp } = shipmentInfo;

    const { items, itemsLoading } = useSelector((state) => state.warehouse.needToShip);
    const docLimits = 10;

    //get limit number of new Awaiting shipment docs
    const updateItems = useCallback((abortSignal) => {
        dispatch(getNeedToShipFromShipmentWithLimit(abortSignal, docLimits, skip));
        setSkip(skip + docLimits);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docLimits, skip])

    //avoid duplicate request append to data state
    useEffect(() => {
        let lastDataDoc = data.at(-1);
        let lastNewDataDoc = items ? items.at(-1) : undefined;

        //init new data to data state
        if (lastDataDoc === undefined && lastNewDataDoc) {
            setData([...items]);
            return;
        }

        //compare if last data object orderID and the last new data object orderID are same.
        if (lastNewDataDoc) {
            let compare = data.at(-1).orderID === items.at(-1).orderID ? true : false
            if (!compare)
                setData([...data, ...items]);
        }
    }, [data, items])

    useEffect(() => {
        const controller = new AbortController();
        updateItems(controller.signal);

        return () => controller.abort();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadMore = () => {
        if (itemsLoading) {
            return;
        }
        updateItems();
    }

    return (
        <div style={{ maxWidth: "80%", margin: "auto" }}>
            <ShipmentStatusBoard shipmentInfo={shipmentInfo} />
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
                    hasMore={data.length !== 0 && data.length < pendingPickUp}
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