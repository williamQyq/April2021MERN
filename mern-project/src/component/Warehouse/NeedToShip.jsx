import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NeedToShipMenu } from 'component/Warehouse/Menus.jsx';
import {
    getNeedToShipFromShipmentWithLimit,
    getNeedToShipPendingAndTotalCount
} from 'reducers/actions/outboundActions.js';
import AwaitingShipmentList from './AwaitingShipmentList.jsx';
import { ContentHeader } from 'component/utility/Layout.jsx';

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

        this.props.getNeedToShipFromShipmentWithLimit(docLimits, docSkip)   //get need to ship shipment
            .then(() => { this.setState({ initLoading: false }); })

        this.props.getNeedToShipPendingAndTotalCount()  //set pending, total, and confirm count
            .then(shipmentInfo => { this.setState({ shipmentInfo }); })
    }

    componentDidUpdate(prevProps) {
        const { docLimits, docSkip, data } = this.state;
        if (prevProps.needToShipItems !== this.props.needToShipItems) {
            this.setState({ data: [...data, ...this.props.needToShipItems], loading: false })
            this.setState({ docSkip: docLimits + docSkip })

            this.props.getNeedToShipPendingAndTotalCount()
                .then(shipmentInfo => { this.setState({ shipmentInfo }); })
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
        const { data, shipmentInfo } = this.state;
        return (
            <>
                <ContentHeader title="NeedToShip" />
                <NeedToShipMenu shipmentInfo={shipmentInfo} />
                <AwaitingShipmentList
                    data={data}
                    loadMore={this.loadMore}
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
    getNeedToShipPendingAndTotalCount: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    needToShipItems: state.warehouse.needToShip.items,
    needToshipItemsLoading: state.warehouse.needToShip.itemsLoading
})

export default connect(mapStateToProps, { getNeedToShipFromShipmentWithLimit, getNeedToShipPendingAndTotalCount })(NeedToShip);