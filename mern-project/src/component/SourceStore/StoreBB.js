import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getBBItems } from 'reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';

import { io } from 'socket.io-client';
const socket = io('localhost:3000', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 5
});

class BB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "BESTBUY"
        }
    }

    componentDidMount() {
        this.props.getBBItems();
        socket.on('itemSpec', () => {
            this.props.getBBItems()
        })
    }

    render() {
        const { items, itemDetail } = this.props;
        const { store } = this.state;
        return (
            <StoreTable items={items} itemDetail={itemDetail} store={store} />
        )
    }
}

BB.prototypes = {
    getBBItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    itemDetail: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.bestbuy.items,
    itemDetail: state.item.itemDetail
})

export default connect(mapStateToProps, { getBBItems })(BB);