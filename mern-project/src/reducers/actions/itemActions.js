import axios from 'axios';
import Moment from 'moment';
import { getBBItems } from './itemBBActions.js';
import { getMSItems } from './itemMSActions.js';
import { message } from 'antd';
import { returnErrors } from './errorActions.js'

import {
    // GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING,
    MICROSOFT,
    BESTBUY,
    SET_TABLE_STATE,
    GET_MS_ITEM_DETAIL,
    GET_BB_ITEM_DETAIL,
    ADD_BB_ITEM_SPEC
} from './types';
import { tokenConfig } from './authActions.js';

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
    axios.delete(`/api/items/${_id}`).then(res => {
        dispatch({
            type: DELETE_ITEM,
            payload: _id
        })
    }).catch(err => {
        dispatch(returnErrors(err.response.data.msg, err.response.status))
    })
};

export const addItem = item => dispatch => {
    axios.post('/api/items', item).then(res =>
        dispatch({
            type: ADD_ITEM,
            payload: res.data
        })
    ).catch(err => {
        dispatch(returnErrors(err.response.data.msg, err.response.status))
    })
};

const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};

const setRouteOnStore = (store) => {
    switch (store) {
        case MICROSOFT:
            return {
                routes: 'ms_items',
                type: {
                    GET_ITEM_DETAIL: GET_MS_ITEM_DETAIL,
                    // ADD_ITEM_SPEC: ADD_MS_ITEM_SPEC,
                }
            }
        case BESTBUY:
            return {
                routes: 'bb_items',
                type: {
                    GET_ITEM_DETAIL: GET_BB_ITEM_DETAIL,
                    ADD_ITEM_SPEC: ADD_BB_ITEM_SPEC,
                }
            }
        default:
            console.error(`[ERROR] storeSwitch did not receive store name`);
    }
}

export const getItemDetail = (store, _id) => dispatch => {

    dispatch(setItemsLoading());
    const { routes, type } = setRouteOnStore(store);
    axios.get(`/api/${routes}/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });
        dispatch({
            type: type.GET_ITEM_DETAIL,
            payload: item
        })
    }).catch(err => {
        dispatch(returnErrors(err.response.data.msg, err.response.status))
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


export const addItemSpec = (record, store) => (dispatch, getState) => {
    dispatch(setItemsLoading);
    const { routes, type } = setRouteOnStore(store)
    axios.put(`/api/${routes}/itemSpec/add`, record, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: type.ADD_ITEM_SPEC,
                payload: res.data
            })
            message.success(res.data.msg)
        })
        .catch(e => {
            dispatch(returnErrors(e.response.data.msg, e.response.status))
        })
}