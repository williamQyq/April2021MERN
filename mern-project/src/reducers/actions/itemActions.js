import axios from 'axios';
import Moment from 'moment';
import { getBBItems } from './itemBBActions';
import { getMSItems } from './itemMSActions';

import {
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING,
    MICROSOFT,
    BESTBUY,
    SET_TABLE_STATE,
    GET_MS_ITEM_DETAIL,
    GET_BB_ITEM_DETAIL
} from './types';

// export const getItems = () => dispatch => {
//     dispatch(setItemsLoading());
//     axios.get('/api/items').then(res =>
//         dispatch({
//             type: GET_ITEMS,
//             payload: res.data
//         })
//     )
// };

export const deleteItem = (_id) => dispatch => {
    axios.delete(`/api/items/${_id}`).then(res =>
        dispatch({
            type: DELETE_ITEM,
            payload: _id
        })

    )
};

export const addItem = item => dispatch => {
    axios.post('/api/items', item).then(res =>
        dispatch({
            type: ADD_ITEM,
            payload: res.data
        })
    )
};

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};

export const getItemDetail = (store, _id) => dispatch => {
    let routes, type;

    dispatch(setItemsLoading());
    switch (store) {
        case MICROSOFT:
            routes = 'ms_items';
            type = GET_MS_ITEM_DETAIL;
            break;
        case BESTBUY:
            routes = 'bb_items';
            type = GET_BB_ITEM_DETAIL;
            break;
        default:
            console.error(`[ERROR] getItemDetail did not receive store name`);
    }

    axios.get(`/api/${routes}/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });
        console.log(JSON.stringify(item))
        dispatch({
            type: type,
            payload: item
        })
    })
}

export const getItems = (store) => dispatch => {
    switch (store) {
        case MICROSOFT:
            getMSItems();
            break;
        case BESTBUY:
            getBBItems();
            break;
        default:
            console.error(`[ERROR] getItems did not receive store name`);
    }
}

export const setTableState = (store, clickedId) => dispatch => {
    dispatch(setItemsLoading());
    let tableState = {
        store: store,
        clickedId: clickedId
    }

    dispatch({
        type: SET_TABLE_STATE,
        payload: tableState
    })
}