import React from 'react';
import { AiOutlineShopping } from 'react-icons/ai';
import IconCover from '@src/component/utils/IconCover.jsx'
import { MenuOption } from '@src/component/utils/cmpt.interface';
import Category from '@src/component/utils/Category';

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