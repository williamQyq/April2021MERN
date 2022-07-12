import axios from 'axios';
import Moment from 'moment';
import { GET_MS_ITEMS, ITEMS_LOADING_MS } from './types';
import { tokenConfig } from './authActions.js';

export const getMSItems = () => (dispatch, getState) => {
    dispatch(setItemsLoading());
    axios.get('/api/ms_items', tokenConfig(getState))
        .then(res => {
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
        })
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_MS
    };
};