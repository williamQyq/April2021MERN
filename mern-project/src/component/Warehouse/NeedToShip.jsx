import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NeedToShipMenu } from 'component/Warehouse/Menus.jsx';
import {
    getNeedToShipFromShipmentWithLimit,
    getNeedToShipPendingAndTotalCount
} from 'reducers/actions/outboundActions.js';
import AwaitingShipmentList from './AwaitingShipmentList.jsx';

class NeedToShip extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            initLoading: true,
            loading: false,
            data: [],
            docLimits: 5,
            docSkip: 0,
            shipmentInfo: {
                pending: 0,
                total: 0,
                confirm: 0
            }
        };
    }

    componentDidMount() {
        const { docLimits, docSkip } = this.state;
        this.props.getNeedToShipFromShipmentWithLimit(docLimits, docSkip);
        getNeedToShipPendingAndTotalCount().then(shipmentInfo => {
            this.setState({ shipmentInfo });
        })
    }
    componentDidUpdate(prevProps) {
        const { docLimits, docSkip, data } = this.state;
        if (prevProps.needToShipItems !== this.props.needToShipItems) {
            this.setState({ data: [...data, ...this.props.needToShipItems], initLoading: false, loading: false })
            this.setState({ docSkip: docLimits + docSkip })
            getNeedToShipPendingAndTotalCount().then(shipmentInfo => {
                this.setState({ shipmentInfo });
            })
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
        this.props.getNeedToShipFromShipmentWithLimit(docLimits, docSkip)
    }

    render() {
        const { totalNeedToShipItemsCount } = this.props;
        const { data, shipmentInfo } = this.state;
        return (
            <>
                <NeedToShipMenu shipmentInfo={shipmentInfo} />
                <AwaitingShipmentList
                    data={data}
                    loadMore={this.loadMore}
                    dataLengthLimit={totalNeedToShipItemsCount}
                    shipmentInfo={shipmentInfo}
                />
            </>

        );
    }
}

NeedToShip.prototypes = {
    needToShipItems: PropTypes.array.isRequired,
    needToShipItemsLoading: PropTypes.bool.isRequired,
    getNeedToShipFromShipmentWithLimit: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    totalNeedToShipItemsCount: state.warehouse.needToShip.totalShipmentCount,
    needToShipItems: state.warehouse.needToShip.items,
    needToshipItemsLoading: state.warehouse.needToShip.itemsLoading
})

export default connect(mapStateToProps, { getNeedToShipFromShipmentWithLimit })(NeedToShip);