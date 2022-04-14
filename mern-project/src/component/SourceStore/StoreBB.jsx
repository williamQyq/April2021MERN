import React, { useContext } from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getBBItems } from 'reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';
import { socket } from 'component/socket/socketContext';


class BB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "BESTBUY"
        }
    }

    componentDidMount() {
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getBBItems();
        socket.on('Store Listings Update', () => {
            this.props.getBBItems()
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

BB.prototypes = {
    getBBItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.bestbuy.items,
    tableState: state.item.tableState
})

export default connect(mapStateToProps, { getBBItems })(BB);