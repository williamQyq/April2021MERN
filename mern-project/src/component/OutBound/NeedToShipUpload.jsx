import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, List, Skeleton } from 'antd';
import { NeedToShipMenu } from 'component/OutBound/Menus.jsx';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { getNeedToShipFromShipment } from 'reducers/actions/outboundActions.js';
import InfiniteScroll from 'react-infinite-scroll-component';

class NeedToShipUpload extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            initLoading: true,
            loading: false,
            data: [],
            docLimits: 5,
            docSkip: 0
        };
    }

    componentDidMount() {
        const { docLimits, docSkip } = this.state;
        this.props.getNeedToShipFromShipment(docLimits, docSkip);
    }
    componentDidUpdate(prevProps) {
        const { docLimits, docSkip, data } = this.state;
        if (prevProps.needToShipItems !== this.props.needToShipItems) {
            this.setState({ data: [...data, ...this.props.needToShipItems], initLoading: false, loading: false })
            this.setState({ docSkip: docLimits + docSkip })
        }

    }
    componentWillUnmount() {
        // let socket = this.context
        // socket.emit(`unsubscribe`, `OutboundRoom`)
    }
    loadMore = () => {
        const { docLimits, docSkip, loading } = this.state;
        if (loading) {
            return;
        }
        this.setState({ loading: true })
        this.props.getNeedToShipFromShipment(docLimits, docSkip)
    }

    render() {
        const { totalNeedToShipItemsCount } = this.props;
        const { data, initLoading } = this.state;
        return (
            <>
                <NeedToShipMenu />
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
                        next={this.loadMore}
                        hasMore={data.length < totalNeedToShipItemsCount}
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
}

NeedToShipUpload.prototypes = {
    needToShipItems: PropTypes.array.isRequired,
    needToShipItemsLoading: PropTypes.bool.isRequired,
    getNeedToShipFromShipment: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    totalNeedToShipItemsCount: state.warehouse.needToShip.totalShipmentCount,
    needToShipItems: state.warehouse.needToShip.items,
    needToshipItemsLoading: state.warehouse.needToShip.itemsLoading
})

export default connect(mapStateToProps, { getNeedToShipFromShipment })(NeedToShipUpload);