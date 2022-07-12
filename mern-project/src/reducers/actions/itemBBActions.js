import axios from 'axios';
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
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions';


export const getBBItems = () => (dispatch, getState) => {
    dispatch(setItemsLoading());
    axios.get('/api/bb_items', tokenConfig(getState)).then(res => {

        //modify created date time format in res.data
        let items = Object.values(res.data);
        items = items.map(item => {
            item.captureDate = Moment(item.captureDate).format("MM-DD-YYYY HH:mm:ss");
            return item
        })
        dispatch({
            type: GET_BB_ITEMS,
            payload: items
        })
    }).catch(err => {
        dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
    })
};

const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_BB
    };
};

export const setTableSettings = (store, clickedId) => dispatch => {
    dispatch(setItemsLoading());

    dispatch({
        type: SET_TABLE_STATE,
        payload: {
            store,
            clickedId
        }
    })
}

export const getMostViewedOnCategoryId = (categoryId) => (dispatch, getState) => {
    dispatch(setMostViewedItemsLoading());
    console.log('Get most viewed request sent...')
    axios.get(`/api/bb_items/mostViewed/${categoryId}`, tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_BB_MOST_VIEWED_ITEMS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
    })

}

export const getViewedUltimatelyBoughtOnSku = (sku) => (dispatch, getState) => {
    dispatch(setMostViewedItemsLoading());
    axios.get(`/api/bb_items/viewedUltimatelyBought/${sku}`, tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
    })

}
export const getAlsoBoughtOnSku = (sku) => (dispatch, getState) => {
    dispatch(setMostViewedItemsLoading());
    axios.get(`/api/bb_items/alsoBought/${sku}`, tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_BB_ALSO_BOUGHT_ITEMS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
    });
}

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
