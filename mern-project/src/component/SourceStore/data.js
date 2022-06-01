import { useSelector } from "react-redux";
import { BESTBUY, MICROSOFT, COSTCO, WALMART } from "reducers/actions/types";

export const categoryIdGroup = {
    ALL_LAPTOPS: 'pcmcat247400050000',
    ASUS_LAPTOPS: 'pcmcat190000050007',
    DELL_LAPTOPS: 'pcmcat140500050010',
    HP_LAPTOPS: 'pcmcat1513015098109',
    LENOVO_LAPTOPS: 'pcmcat230600050000',
    SAMSUNG_LAPTOPS: 'pcmcat1496261338353',
    SURFACE: 'pcmcat1492808199261'
}

export const STORE = {
    BESTBUY,
    MICROSOFT,
    COSTCO,
    WALMART
}