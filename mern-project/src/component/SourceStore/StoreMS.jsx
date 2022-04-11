import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getMSItems } from 'reducers/actions/itemMSActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';

import { io } from 'socket.io-client';
const socket = io('/', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 5
});
socket.emit(`Store`, `StoreListingRoom`);

class MS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "MICROSOFT"
        };

    }

    componentDidMount() {
        this.props.getMSItems();
        socket.on('MS Store Listings Update', () => {
            this.props.getMSItems()
        })
    }
    render() {
        const { store } = this.state;
        return (
            <StoreTable {...this.props} store={store} />
        )
    }
}

MS.prototypes = {
    getMSItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.microsoft.items,
    tableState: state.item.tableState
})

export default connect(mapStateToProps, { getMSItems })(MS);