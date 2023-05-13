import React from "react";
import { connect } from "react-redux";
import SearchShipment from "./SearchShipment.jsx";
import { ContentHeader } from "@src/component/utils/Layout.jsx";
import { SEARCH_LOCATION_INVENTORY, SEARCH_OUTBOUND_SHIPMENT, SEARCH_RECEIVAL_SHIPMENT, SEARCH_SELLER_INVENTORY } from "@src/redux/actions/types.js";
import Proptypes from 'prop-types';


class SearchRecords extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    createCategoryHeader = (category) => {
        switch (category) {
            case SEARCH_OUTBOUND_SHIPMENT:
                return "Search OutBound Shipment";
            case SEARCH_RECEIVAL_SHIPMENT:
                return "Search Receival Shipment";
            case SEARCH_LOCATION_INVENTORY:
                return "Search Location Inventory";
            case SEARCH_SELLER_INVENTORY:
                return "Search Seller Inventory";
            default:
                return;
        }
    }

    render() {
        const { category } = this.props;
        let title = this.createCategoryHeader(category);
        return (
            <>
                <ContentHeader title={title} />
                <SearchShipment />
            </>
        );

    }

}

SearchRecords.prototypes = {
    category: Proptypes.string.isRequired
}

const mapStateToProps = (state) => ({
    category: state.warehouse.shipmentSearch.category,
})

export default connect(mapStateToProps, null)(SearchRecords);