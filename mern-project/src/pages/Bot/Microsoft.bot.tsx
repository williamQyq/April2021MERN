import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SocketContext, socketType } from '@src/component/socket/SocketProvider';
import StoreTable from '@view/Bot/StoreTable.jsx';
import { storeType } from '@src/component/utils/cmpt.global';
import {
    handleErrorOnRetrievedItemsOnlinePrice,
    handleOnRetrievedItemsOnlinePrice
} from '@redux-action/itemActions.js';
import { getMSItems } from '@redux-action/itemMSActions.js';

class MS extends React.Component {
    static contextType = SocketContext
    constructor(props) {
        super(props);
        this.state = {
            store: storeType.MICROSOFT
        };

    }

    componentDidMount() {
        let socket = this.context;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getMSItems();
        socket.on('Store Listings Update', () => {
            this.props.getMSItems()
        })
        socket.on(socketType.ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE, (data) => {
            this.props.handleOnRetrievedItemsOnlinePrice(this.state.store, data.msg)
        })
        socket.on(socketType.RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR, (data) => {
            this.props.handleErrorOnRetrievedItemsOnlinePrice(this.state.store, data.msg)
        })
    }
    componentWillUnmount() {
        let socket = this.context;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
    }

    render() {
        const data = {
            storeName: this.state.store,
            items: this.props.items,
            loading: this.props.loading
        }
        return (
            <StoreTable {...data} />
        )
    }
}

MS.prototypes = {
    getMSItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    items: state.microsoft.items,
    tableState: state.item.tableState,
    loading: state.microsoft.loading
})

export default connect(mapStateToProps, { getMSItems, handleOnRetrievedItemsOnlinePrice, handleErrorOnRetrievedItemsOnlinePrice })(MS);