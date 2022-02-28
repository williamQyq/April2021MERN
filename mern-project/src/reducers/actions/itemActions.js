import axios from 'axios';
import Moment from 'moment';
import { getBBItems } from './itemBBActions';
import { getMSItems } from './itemMSActions';
import { message } from 'antd';
import { returnErrors } from './errorActions'

import {
    // GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING,
    MICROSOFT,
    BESTBUY,
    SET_TABLE_STATE,
    GET_MS_ITEM_DETAIL,
    ADD_MS_ITEM_SPEC,
    GET_BB_ITEM_DETAIL,
    ADD_BB_ITEM_SPEC
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

const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};

const storeSwitch = (store) => {
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
    const { routes, type } = storeSwitch(store);
    axios.get(`/api/${routes}/detail/${_id}`).then(res => {
        let item = Object.values(res.data).pop();
        item.price_timestamps.forEach(ts => {
            ts.date = Moment(ts.date).format("MMM Do YYYY HH:mm a");
        });
        dispatch({
            type: type.GET_ITEM_DETAIL,
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


export const addItemSpec = (record, store) => dispatch => {
    dispatch(setItemsLoading);
    const config = { headers: { 'Content-Type': 'application/json' } }

    const { routes, type } = storeSwitch(store)
    axios.put(`/api/${routes}/itemSpec/add`, record, config)
        .then(res => {
            if (res.data.status === "success") {
                dispatch({
                    type: type.ADD_ITEM_SPEC,
                    payload: res.data
                })
                message.success(res.data.msg)
            } else {
                message.warn(res.data.msg)
                dispatch(returnErrors(res.data.msg, res.data.status))
            }
        })
        .catch(e => {
            message.warn("addItemSpec failed.")
            dispatch(returnErrors("addItemSpec failed.", "error"))
        })
}