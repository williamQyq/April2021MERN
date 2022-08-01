import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, PageHeader, Skeleton } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';
import { getNeedToShipPendingAndTotalCount } from 'reducers/actions/outboundActions.js';

const AwaitingShipmentList = (props) => {
    const { data, loadMore, dataLengthLimit } = props;
    const [pending, SetPending] = useState(0);
    const [total, SetTotal] = useState(0);

    useEffect(() => {
        getNeedToShipPendingAndTotalCount().then(pendingShipmentInfo => {
            SetPending(pendingShipmentInfo.pending);
            SetTotal(pendingShipmentInfo.total);
        });
    },[])

    return (
        <>
            <Divider plain><PageHeader title="Awaiting Shipment" /></Divider>
            <ShipmentStatusBoard shipmentInfo={{ pending, total }}></ShipmentStatusBoard>
            <div
                id="scrollableDiv"
                style={{
                    height: "80vh",
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMore}
                    hasMore={data.length < dataLengthLimit}
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
                            <List.Item key={item.orderID}>
                                <DescriptionCard detail={item} />
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </>

    );
}

export default AwaitingShipmentList;