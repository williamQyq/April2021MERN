import React from 'react';
import { GrAmazon } from 'react-icons/gr';
import { TbHeartRateMonitor } from 'react-icons/tb';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import IconCover from 'component/utility/IconCover.jsx';
import { MenuOption } from 'component/utility/cmpt.interface.d';
import Category from 'component/utility/Category';


const forReturnFeatures: MenuOption[] = [
    {
        key: "product-start-up",
        title: "Get Started",
        description: "Start Creating a new Product",
        cover: <IconCover Icon={MdOutlineTipsAndUpdates} />
    },
    {
        key: "amazon-products-list",
        title: "Amazon Management",
        description: "Amazon SKU management",
        cover: <IconCover Icon={GrAmazon} />
    },
    {
        key: "amazon-surveillance",
        title: "Amazon Surveillance",
        description: "Amazon sku follower surveillance, Amazon price surveillance, wrong config surveillance",
        cover: <IconCover Icon={TbHeartRateMonitor} />
    },
    {
        key: "amazon-listing-template",
        title: "Amazon Listing Template",
        description: "Generate Amazon Listing Upload Template",
        cover: <IconCover Icon={RiUploadCloud2Line} />
    }
]

const ForReturnCtg: React.FC = () => {
    return (
        <Category title="For Return" categories={forReturnFeatures} />
    );
}

export default ForReturnCtg;