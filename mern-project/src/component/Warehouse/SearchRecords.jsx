import React from "react";
import { connect } from "react-redux";
import { Anchor } from "antd";
import SearchShipment from "./SearchShipment.jsx";
import { ContentHeader, SubContentHeader } from "component/utility/Layout";
import { SEARCH_LOCATION_INVENTORY, SEARCH_OUTBOUND_SHIPMENT, SEARCH_RECEIVAL_SHIPMENT } from "reducers/actions/types.js";
import Proptypes from 'prop-types';

const { Link } = Anchor;

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
            default:
                return;
        }
    }

    render() {
        let categoryTitle = this.createCategoryHeader(this.props.category);

        return (
            <>
                <ContentHeader title="Search" />
                <Anchor>
                    <Link href="#components-anchor-search-shipment" title="Search Shipment" />
                    <Link href="#components-anchor-search-receival" title="Search Receival" />
                    <Link href="#components-anchor-search-location" title="Search Location" />
                </Anchor>

                <SubContentHeader
                    title={categoryTitle}
                    subTitle={<a href="#components-anchor-search-shipment" title="" />}
                />
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