import axios from 'axios';
import Moment from 'moment';
import { returnErrors } from './errorActions';
import {
    GET_BB_ITEMS,
    GET_BB_ITEM_DETAIL,
    SET_TABLE_STATE,
    ITEMS_LOADING_BB,
    MOST_VIEWED_ITEMS_LOADING,
    GET_BB_MOST_VIEWED_ITEMS,
    GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
    GET_BB_ALSO_BOUGHT_ITEMS,
    GET_BESTBUY_API_ERRORS
} from './types';
import { tokenConfig } from './authActions.js';

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
        dispatch(returnErrors(err.response.data.msg, err.response.status))
    })
};

const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_BB
    };
};

export const getBBItemDetail = (_id) => dispatch => {
    dispatch(setItemsLoading());
    axios.get(`/api/bb_items/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        // console.log(` Action called: \n${JSON.stringify(item)}`);
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });

        dispatch({
            type: GET_BB_ITEM_DETAIL,
            payload: item
        })
    })
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

export const getMostViewedOnCategoryId = (categoryId) => dispatch => {
    dispatch(setMostViewedItemsLoading());
    console.log('Get most viewed request sent...')
    axios.get(`/api/bb_items/mostViewed/${categoryId}`).then(res => {
        dispatch({
            type: GET_BB_MOST_VIEWED_ITEMS,
            payload: res.data
        })
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status, categoryId))
    })

}

export const getViewedUltimatelyBoughtOnSku = (sku) => dispatch => {
    dispatch(setMostViewedItemsLoading());
    axios.get(`/api/bb_items/viewedUltimatelyBought/${sku}`).then(res => {
        dispatch({
            type: GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status));
    })

}
export const getAlsoBoughtOnSku = (sku) => dispatch => {
    dispatch(setMostViewedItemsLoading());
    axios.get(`/api/bb_items/alsoBought/${sku}`).then(res => {
        dispatch({
            type: GET_BB_ALSO_BOUGHT_ITEMS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(resetBestbuyApiMostViewedItems());
        dispatch(returnErrors(err.response.data.msg, err.response.status));
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
