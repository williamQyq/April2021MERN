import axios, { CanceledError } from 'axios';
import Moment from 'moment';
import {
    GET_BB_ITEMS,
    SET_TABLE_STATE,
    ITEMS_LOADING_BB,
    MOST_VIEWED_ITEMS_LOADING,
    GET_BB_MOST_VIEWED_ITEMS,
    GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
    GET_BB_ALSO_BOUGHT_ITEMS,
    GET_BESTBUY_API_ERRORS,
    GET_ERRORS
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { AppDispatch, DealsDataSourceType, myAxiosError } from '../interface';

export const getBestbuyDeals = (abortSignal?: AbortSignal): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setItemsLoading());
        axios.get<DealsDataSourceType>(
            '/api/bestbuy/v1/deals', {
            signal: abortSignal,
            ...tokenConfig(getState)
        })
            .then(res => {
                //modify created date time format in res.data
                let deals = Object.values(res.data).map(deal => {
                    deal.captureDate = Moment(deal.captureDate).format("MM-DD-YYYY HH:mm:ss");
                    return deal;
                })
                dispatch({
                    type: GET_BB_ITEMS,
                    payload: deals
                })
            })
            .catch((err: CanceledError<any> | myAxiosError) => {
                if (err.name === "CanceledError") {
                    console.log(`Request canceled`, err.name);
                } else {
                    let myErr = err as myAxiosError;
                    dispatch(returnErrors(
                        myErr.response.data.msg,
                        myErr.response.status,
                    ));
                }

            })
    };

const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_BB
    };
};

/**
 * 
 * @param store 
 * @param clickedId 
 * @returns 
 * @description 
 *  #TODO save table user settings
 */
export const setTableSettings = (store: string, clickedId: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch) => {
        dispatch({
            type: SET_TABLE_STATE,
            payload: {
                store,
                clickedId
            }
        });
    }

/**
 * @description Get Bestbuy affiliate most viewed products
 * @param categoryId 
 * @returns 
 */
export const getMostViewedOnCategoryId = (categoryId: string): ThunkAction<any, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setMostViewedItemsLoading());
        console.log('Get most viewed request sent...')
        axios.get(`/api/bestbuy/peek/v0/getMostViewed/categoryId/${categoryId}`, tokenConfig(getState)).then(res => {
            dispatch({
                type: GET_BB_MOST_VIEWED_ITEMS,
                payload: res.data
            })
        }).catch(err => {
            dispatch(resetBestbuyApiMostViewedItems());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_BESTBUY_API_ERRORS))
        })

    }

/**
 * @description Get Bestbuy affiliate api
 * @param sku 
 * @returns 
 */
export const getViewedUltimatelyBoughtOnSku = (sku: string): ThunkAction<any, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setMostViewedItemsLoading());
        axios.get<unknown>(`/api/bestbuy/peek/v0/getViewedUltimatelyBought/sku/${sku}`, tokenConfig(getState)).then(res => {
            dispatch({
                type: GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
                payload: res.data
            });
        }).catch(err => {
            dispatch(resetBestbuyApiMostViewedItems());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_BESTBUY_API_ERRORS));
        })

    }

/**
 * @description Get BestBuy affiliate also bought api.
 * @param sku 
 * @returns 
 */
export const getAlsoBoughtOnSku = (sku: string): ThunkAction<void, RootState, any, AnyAction> =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setMostViewedItemsLoading());
        axios.get<unknown>(`/api/bestbuy/peek/v0/getAlsoBought/sku/${sku}`, tokenConfig(getState)).then(res => {
            dispatch({
                type: GET_BB_ALSO_BOUGHT_ITEMS,
                payload: res.data
            });
        }).catch(err => {
            dispatch(resetBestbuyApiMostViewedItems());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_BESTBUY_API_ERRORS));
        });
    }

/**
 * @description Dispatch action type for Redux
 * @returns 
 * 
 */
const setMostViewedItemsLoading = () => {
    return {
        type: MOST_VIEWED_ITEMS_LOADING
    };
};
const resetBestbuyApiMostViewedItems = () => {
    return {
        type: GET_BESTBUY_API_ERRORS
    }
}
