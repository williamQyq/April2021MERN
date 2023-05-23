import axios, { AxiosResponse } from 'axios';
import Moment from 'moment';
import { clearErrors, returnErrors } from './errorActions'
import {
    // GET_ITEMS,
    BESTBUY,
    MICROSOFT,
    GET_ERRORS,
    ITEMS_LOADING,
    SET_TABLE_STATE,
    GET_MS_ITEM_DETAIL,
    GET_BB_ITEM_DETAIL,
    ADD_BB_ITEM_SPEC,
    GET_MS_ITEMS_ONLINE_PRICE,
    GET_BB_ITEMS_ONLINE_PRICE,
    MS_ITEMS_ONLINE_PRICE_LOADING,
    BB_ITEMS_ONLINE_PRICE_LOADING,
    CLEAR_MICROSOFT_ERRORS,
    CLEAR_BESTBUY_ERRORS,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    SERVICE_UNAVAILABLE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR,
} from './types.js';
import { tokenConfig } from './authActions';
import { clearMessages, returnMessages } from './messageActions';
import { RootState, AppDispatch } from '../store/store';
import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { myAxiosResponse } from '../interface.js';

const setItemsLoading = () => ({
    type: ITEMS_LOADING
});

function getRoutesAndActionTypes(selectedStore: string) {
    switch (selectedStore) {
        case MICROSOFT:
            return {
                routes: 'microsoft',
                type: {
                    CLEAR_ERRORS: CLEAR_MICROSOFT_ERRORS,
                    GET_ITEM_DETAIL: GET_MS_ITEM_DETAIL,
                    GET_ITEM_ONLINE_PRICE: GET_MS_ITEMS_ONLINE_PRICE,
                    ITEMS_ONLINE_PRICE_LOADING: MS_ITEMS_ONLINE_PRICE_LOADING,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
                    FAILED_RETRIEVE_DEALS_INFO: RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
                }
            }
        case BESTBUY:
            return {
                routes: 'bestbuy',
                type: {
                    CLEAR_ERRORS: CLEAR_BESTBUY_ERRORS,
                    GET_ITEM_DETAIL: GET_BB_ITEM_DETAIL,
                    ADD_ITEM_SPEC: ADD_BB_ITEM_SPEC,
                    GET_ITEM_ONLINE_PRICE: GET_BB_ITEMS_ONLINE_PRICE,
                    ITEMS_ONLINE_PRICE_LOADING: BB_ITEMS_ONLINE_PRICE_LOADING,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
                    FAILED_RETRIEVE_DEALS_INFO: RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR
                }
            }
        default:
            return;
    }
}

export const signalPriceCrawler = (store: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const routerConfig = getRoutesAndActionTypes(store);    //get routes and action types on store selection
        if (!routerConfig) return;
        dispatch({ type: routerConfig.type.ITEMS_ONLINE_PRICE_LOADING });
        axios.get(`/api/${routerConfig.routes}/crawl/v1/laptop/prices`, tokenConfig(getState))
            .then((res: myAxiosResponse) => {
                dispatch(returnMessages(res.data.msg, res.status, routerConfig.type.ITEMS_ONLINE_PRICE_LOADING));
            })
            .catch(err => {
                dispatch(clearMessages())
                dispatch(returnMessages(err.response.msg, err.response.status, GET_ERRORS))
            })
    }

export const handlePriceCrawlFinished = (store: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch) => {
        const routerConfig = getRoutesAndActionTypes(store);    //get routes and action types on store selection
        if (!routerConfig) return;
        dispatch({
            type: routerConfig.type.GET_ITEM_ONLINE_PRICE
        })
        dispatch(clearMessages())
        dispatch(returnMessages(`${store} Bot Finished!`, 200, routerConfig.type.GET_ITEM_ONLINE_PRICE))
    }

export const handlePriceCrawlError = (store: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch) => {
        const routerConfig = getRoutesAndActionTypes(store);
        if (!routerConfig) return;
        dispatch({
            type: routerConfig.type.GET_ITEM_ONLINE_PRICE
        })
        dispatch(clearErrors(routerConfig.type.CLEAR_ERRORS))
        dispatch(returnErrors(`${store} Bot throw Exceptions`, 400, routerConfig.type.FAILED_RETRIEVE_DEALS_INFO))
    }

export interface DealDataType {
    link: string,
    name: string,
    sku: string,
    qty: number,
    upc: string,
    price_timestamps: { price: number, date: Date | string }[],
    currentPrice: number,
    priceDiff: number,
}

export const getItemDetail = (store: string, _id: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setItemsLoading());
        const routerConfig = getRoutesAndActionTypes(store);    //get routes and action types on store selection
        axios.get<any, AxiosResponse<DealDataType>>(`/api/${routerConfig?.routes}/v1/deal/detail/id/${_id}`, tokenConfig(getState))
            .then(res => {
                let deal = res.data;
                deal.price_timestamps.forEach(ts => {
                    ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
                });
                dispatch({
                    type: routerConfig!.type.GET_ITEM_DETAIL,
                    payload: deal
                })
            })
            .catch(err => {
                dispatch(returnErrors(err.response.data.msg, err.response.status))
            })
    }

// export const getItems = (store) => dispatch => {
//     switch (store) {
//         case MICROSOFT:
//             getMSItems();
//             break;
//         case BESTBUY:
//             getBestbuyDeals();
//             break;
//         default:
//             let errorMsg = `[ERROR] getItems invalid ${store}`
//             dispatch(returnErrors(errorMsg, 404));
//     }
// }

export const saveUserTableSettings = (settings: any): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch) => {
        dispatch(setItemsLoading());
        dispatch({
            type: SET_TABLE_STATE,
            payload: { ...settings }
        })
    }

export const addItemSpec = (record: unknown, store: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setItemsLoading);
        const routerConfig = getRoutesAndActionTypes(store)
        if (!routerConfig) {
            dispatch(clearMessages())
            dispatch(returnMessages("Get Item Specification is currently not available ", 202, SERVICE_UNAVAILABLE))
            return;
        }

        dispatch(returnMessages("Working on online price retrieval...\nPlease wait.", 202, routerConfig.type.ADD_ITEM_SPEC))
        axios.put(`/api/${routerConfig.routes}/item-specification/`, record, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: routerConfig.type.ADD_ITEM_SPEC,
                    payload: res.data
                })
                dispatch(clearMessages())
                dispatch(returnMessages(res.data.msg, res.status))
            })
            .catch(e => {
                dispatch(returnErrors(e.response.data.msg, e.response.status))
            })
    }
