import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, PageHeader, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';

const AwaitingShipmentList = (props) => {
    const { data, loadMore, shipmentInfo } = props;
    const [pending, SetPending] = useState(shipmentInfo.pending);
    const [total, SetTotal] = useState(shipmentInfo.total);
    const [awaitingShipment, SetAwaitingShipment] = useState(data);

    useEffect(() => {
        SetPending(Number(shipmentInfo.pending));
        SetTotal(Number(shipmentInfo.total));
        SetAwaitingShipment(data)
    }, [shipmentInfo.pending, shipmentInfo.total, data])

    return (
        <>
            <Divider plain><PageHeader title="Awaiting Shipment" /></Divider>
            <div
                id="scrollableDiv"
                style={{
                    height: "120vh",
                    margin: "auto",
                    maxWidth: '60vw',
                    overflow: 'auto',
                    padding: '0 16px',
                    // border: '1px solid #fbfbfd',
                    background: "linear-gradient(145deg, #e2e2e4, #ffffff)",
                    boxShadow: "5px 5px 10px #9c9c9d"
                }}
            >
                <ShipmentStatusBoard shipmentInfo={{ pending, total }}></ShipmentStatusBoard>
                <InfiniteScroll
                    dataLength={awaitingShipment.length}
                    next={loadMore}
                    hasMore={awaitingShipment.length < total}
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
                        dataSource={awaitingShipment}
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