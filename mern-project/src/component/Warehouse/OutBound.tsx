import React from 'react';
import IconCover from 'component/utility/IconCover.jsx';
import { FaTruckLoading, FaWarehouse, FaSearch } from 'react-icons/fa';
import Category from 'component/utility/Category';

const outboundMenuFeatures = [
    {
        key: "needToShip",
        title: "Need to Ship",
        description: "Update Seller Inventory Quantity",
        cover: <IconCover Icon={FaTruckLoading} />
    },
    {
        key: "inventoryReceived",
        title: "Inventory Receive",
        description: "Manage received Inventory",
        cover: <IconCover Icon={FaWarehouse} />
    },
    {
        key: "searchRecord",
        title: "Search",
        description: "Search Records",
        cover: <IconCover Icon={FaSearch} />
    }
]

const OutboundCtg: React.FC = () => {
    return (
        <Category title="Outbound" categories={outboundMenuFeatures} />
    );
}

export default OutboundCtg;