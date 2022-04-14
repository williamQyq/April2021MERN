import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getMSItems } from 'reducers/actions/itemMSActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';
import { socket } from 'component/socket/socketContext';

class MS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "MICROSOFT"
        };

    }
    componentDidMount() {
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getMSItems();
        socket.on('Store Listings Update', () => {
            this.props.getMSItems()
        })
    }
    componentWillUnmount() {
        socket.emit(`unsubscribe`, `StoreListingRoom`)
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