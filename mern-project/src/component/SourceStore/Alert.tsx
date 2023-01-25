import React from 'react';
import { AiOutlineShopping } from 'react-icons/ai';
import IconCover from 'component/utility/IconCover.jsx'
import { MenuOption } from 'component/utility/cmpt.interface.d';
import Category from 'component/utility/Category';

const alertFeatures: MenuOption[] = [
    {
        key: "bestbuy-list",
        title: "Bestbuy Deal",
        description: "Bestbuy Deal Lookup",
        cover: <IconCover Icon={AiOutlineShopping} />
    },
    {
        key: "microsoft-list",
        title: "Microsoft Deal",
        description: "MicroSoft Deal Lookup",
        cover: <IconCover Icon={AiOutlineShopping} />
    },
    {
        key: "walmart-list",
        title: "Walmart Deal",
        description: "Walmart Deal Lookup",
        cover: <IconCover Icon={AiOutlineShopping} />
    }
]

const AlertCtg: React.FC = () => {
    return (
        <Category title="Deal Alert" categories={alertFeatures} />
    );
}

export default AlertCtg;