import React from "react";
import { Anchor } from "antd";
import { ContentHeader, SubContentHeader } from "component/utility/Layout";
import SearchShipment from "./SearchShipment.jsx";

const { Link } = Anchor;

export default class SearchRecords extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <>
                <ContentHeader title="Search" />
                <Anchor>
                    <Link href="#components-anchor-search-shipment" title="Search Shipment" />
                    <Link href="#components-anchor-search-receival" title="Search Receival" />
                    <Link href="#components-anchor-search-location" title="Search Location" />
                </Anchor>

                <SubContentHeader
                    title="Search Shipment"
                    subTitle={<a href="#components-anchor-search-shipment" title="" />}
                />
                <SearchShipment />
            </>
        );

    }

}