import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getWMItems as getItems } from 'reducers/actions/itemWMActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';
import { SocketContext } from 'component/socket/socketContext';

class WM extends React.Component {
    static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            store: "WALMART"
        }
    }

    componentDidMount() {
        let socket = this.context;
        socket.emit(`subscribe`, `StoreListingRoom`);

        // this.props.getItems();
        // socket.on('WM Store Listings Update', () => {
        //     this.props.getItems()
        // })
    }
    componentWillUnmount() {
        let socket = this.context;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
        // socket.disconnect()
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

WM.prototypes = {
    getItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    items: state.walmart.items,
    tableState: state.item.tableState,
    loading: state.walmart.loading
})

export default connect(mapStateToProps, { getItems })(WM);