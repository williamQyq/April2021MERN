import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getWMItems as getItems } from 'reducers/actions/itemWMActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';
import { socket } from 'component/socket/socketContext';

class WM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "WALMART"
        }
    }

    componentDidMount() {
        socket.emit(`subscribe`, `StoreListingRoom`);

        // this.props.getItems();
        // socket.on('WM Store Listings Update', () => {
        //     this.props.getItems()
        // })
    }
    componentWillUnmount() {
        socket.emit(`unsubscribe`, `StoreListingRoom`)
        // socket.disconnect()
    }

    render() {
        const { store } = this.state;
        return (
            <StoreTable {...this.props} store={store} />
        )
    }
}

WM.prototypes = {
    getItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.walmart.items,
    tableState: state.item.tableState
})

export default connect(mapStateToProps, { getItems })(WM);