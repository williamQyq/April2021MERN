import axios from 'axios';
import Moment from 'moment';
import { GET_MS_ITEMS, GET_MS_ITEM_DETAIL, ITEMS_LOADING_MS } from './types';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';

export const getMSItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/ms_items').then(res => {

        //modify created date time format in res.data
        let items = Object.values(res.data);
        items = items.map(item => {
            item.captureDate = Moment(item.captureDate).format("MM-DD-YYYY HH:mm:ss");
            return item
        })
        dispatch({
            type: GET_MS_ITEMS,
            payload: items
        })
    }
    )
};

export const getMSItemsPrice = () => (dispatch, getState) => {
    dispatch(setItemsLoading());
    axios.get('/api/ms_items/itemsPrice', tokenConfig(getState)).then(res => {

    }).catch(err => {
        dispatch(returnErrors(err.response.data.msg, err.response.status))
    })
}


export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_MS
    };
};

export const getMSItemDetail = (_id) => dispatch => {
    axios.get(`/api/ms_items/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });
        dispatch({
            type: GET_MS_ITEM_DETAIL,
            payload: item
        })
    })
};

