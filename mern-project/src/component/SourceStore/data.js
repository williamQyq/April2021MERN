import {
    BESTBUY,
    MICROSOFT,
    COSTCO,
    WALMART,
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_BB_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_MS_ITEMS_ONLINE_PRICE,
} from "reducers/actions/types.js";

export const categoryIdGroup = {
    ALL_LAPTOPS: 'pcmcat247400050000',
    ASUS_LAPTOPS: 'pcmcat190000050007',
    DELL_LAPTOPS: 'pcmcat140500050010',
    HP_LAPTOPS: 'pcmcat1513015098109',
    LENOVO_LAPTOPS: 'pcmcat230600050000',
    SAMSUNG_LAPTOPS: 'pcmcat1496261338353',
    SURFACE: 'pcmcat1492808199261'
}

export const storeType = {
    BESTBUY,
    MICROSOFT,
    COSTCO,
    WALMART
}

export const socketType = {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_BB_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_MS_ITEMS_ONLINE_PRICE
}