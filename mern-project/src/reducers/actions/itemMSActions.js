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

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_MS
    };
};