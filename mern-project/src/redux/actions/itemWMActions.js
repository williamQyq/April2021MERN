import axios from 'axios';
import Moment from 'moment';
import {
    GET_WM_ITEMS,
    GET_WM_ITEM_DETAIL,
    ITEMS_LOADING_WM,
    SET_TABLE_STATE,
} from './types';

export const getWMItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/wm_items').then(res => {

        //modify created date time format in res.data
        let items = Object.values(res.data);
        items = items.map(item => {
            item.captureDate = Moment(item.captureDate).format("MM-DD-YYYY HH:mm:ss");
            return item
        })
        dispatch({
            type: GET_WM_ITEMS,
            payload: items
        })
    }
    )
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING_WM
    };
};

export const getWMItemDetail = (_id) => dispatch => {
    dispatch(setItemsLoading());
    axios.get(`/api/wm_items/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        // console.log(` Action called: \n${JSON.stringify(item)}`);
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });

        dispatch({
            type: GET_WM_ITEM_DETAIL,
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
