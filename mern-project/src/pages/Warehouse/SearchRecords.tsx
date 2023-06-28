import React from "react";
import { ConnectedProps, connect } from "react-redux";
import SearchShipment from "./SearchShipment";
import { ContentHeader } from "@src/component/utils/Layout";
import { SEARCH_LOCATION_INVENTORY, SEARCH_OUTBOUND_SHIPMENT, SEARCH_RECEIVAL_SHIPMENT, SEARCH_SELLER_INVENTORY } from "@src/redux/actions/types.js";
import { RootState } from "@src/redux/store/store.js";

interface IProps extends PropsFromRedux {

};
interface IState { };
class SearchRecords extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    createCategoryHeader = (category: string): string => {
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
                return "UNKNOWN";
        }
    }

    render() {
        const { category } = this.props;
        const title = this.createCategoryHeader(category);
        return (
            <>
                <ContentHeader title={title} />
                <SearchShipment />
            </>
        );

    }

}

const mapStateToProps = (state: RootState) => ({
    category: state.warehouse.shipmentSearch.category,
})
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(SearchRecords);