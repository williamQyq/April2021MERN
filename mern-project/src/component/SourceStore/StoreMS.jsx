import React from 'react';
import 'component/SourceStore/Store.scss';
import { connect } from 'react-redux';
import { getMSItems } from 'reducers/actions/itemMSActions';
import PropTypes from 'prop-types';
import StoreTable from 'component/SourceStore/StoreTable';

class MS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: "MICROSOFT"
        };

    }

    componentDidMount() {
        this.props.getMSItems();
    }
    render() {
        const { items, itemDetail } = this.props;
        const { store } = this.state;
        return (
            <StoreTable items={items} itemDetail={itemDetail} store={store} />
        )
    }
}

MS.prototypes = {
    getMSItems: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    itemDetail: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    items: state.microsoft.items,
    itemDetail: state.item.itemDetail
})

export default connect(mapStateToProps, { getMSItems })(MS);