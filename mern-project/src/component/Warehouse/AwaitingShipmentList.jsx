import InfiniteScroll from 'react-infinite-scroll-component';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { Divider, List, Skeleton } from 'antd';
import ShipmentStatusBoard from './ShipmentStatusBoard.jsx';

const AwaitingShipmentList = (props) => {
    const { data, loadMore, shipmentInfo } = props;
    const { pending, total } = shipmentInfo;
    
    return (
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
            <ShipmentStatusBoard shipmentInfo={{ pending, total }} />
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
    );
}

export default AwaitingShipmentList;