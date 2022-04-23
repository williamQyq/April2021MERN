import React from 'react';
import { connect } from 'react-redux';
import { getBBItems, getMostViewedOnCategoryId, getViewedUltimatelyBoughtOnSku } from 'reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import { SocketContext } from 'component/socket/socketContext.js';
import StoreTable from 'component/SourceStore/StoreTable.jsx';
import StoreAnalyticCards from 'component/SourceStore/StoreAnalyticCards.jsx'


class BB extends React.Component {
    static contextType = SocketContext  //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            store: "BESTBUY",
        }
    }

    componentDidMount() {
        let socket = this.context;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getBBItems();
        // this.props.getMostViewedOnCategoryId("pcmcat1525722993128");
        // this.props.getViewedUltimatelyBoughtOnSku("6481063")
        socket.on('Store Listings Update', () => {
            this.props.getBBItems()
        })
    }
    componentWillUnmount() {
        let socket = this.context;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
    }

    render() {
        const { store } = this.state;
        return (
            <>
                <StoreTable {...this.props} store={store} />
                <StoreAnalyticCards />
            </>
        )
    }
}

BB.prototypes = {
    getBBItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    mostViewedItems: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.bestbuy.items,
    mostViewedItems: state.bestbuy.mostViewedItems,
    tableState: state.item.tableState
})

export default connect(mapStateToProps, { getBBItems, getMostViewedOnCategoryId, getViewedUltimatelyBoughtOnSku })(BB);