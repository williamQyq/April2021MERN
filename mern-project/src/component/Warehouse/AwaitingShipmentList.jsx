import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, PageHeader, Skeleton } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';

const AwaitingShipmentList = (props) => {
    const { data, loadMore, dataLengthLimit, pendingShipmentInfo } = props;
    const [pending, SetPending] = useState(0);
    const [total, SetTotal] = useState(0);

    useEffect(() => {
        SetPending(pendingShipmentInfo.pending);
        SetTotal(pendingShipmentInfo.total);
    }, [pendingShipmentInfo])

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
                    // border: '1px solid #fbfbfd',
                    background: "linear-gradient(145deg, #e2e2e4, #ffffff)",
                    boxShadow: "5px 5px 10px #9c9c9d"
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