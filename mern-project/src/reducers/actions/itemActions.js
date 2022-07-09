import axios from 'axios';
import Moment from 'moment';
import { getBBItems } from './itemBBActions.js';
import { getMSItems } from './itemMSActions.js';
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
    ADD_BB_ITEM_SPEC,
    GET_MS_ITEMS_ONLINE_PRICE,
    GET_BB_ITEMS_ONLINE_PRICE,
    MS_ITEMS_ONLINE_PRICE_LOADING,
    BB_ITEMS_ONLINE_PRICE_LOADING,
    CLEAR_MICROSOFT_ERRORS,
    CLEAR_BESTBUY_ERRORS,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE
} from './types';
import { tokenConfig } from './authActions.js';
import { clearMessages, returnMessages } from './messageActions.js';

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
const setItemsOnlinePriceLoading = (loadingType) => {
    return {
        type: loadingType
    }
}

const setRouteOnStore = (store) => {
    switch (store) {
        case MICROSOFT:
            return {
                routes: 'ms_items',
                type: {
                    GET_ITEM_DETAIL: GET_MS_ITEM_DETAIL,
                    GET_ITEM_ONLINE_PRICE: GET_MS_ITEMS_ONLINE_PRICE,
                    ITEMS_ONLINE_PRICE_LOADING: MS_ITEMS_ONLINE_PRICE_LOADING,
                    CLEAR_ERRORS: CLEAR_MICROSOFT_ERRORS,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
                    // ADD_ITEM_SPEC: ADD_MS_ITEM_SPEC,
                }
            }
        case BESTBUY:
            return {
                routes: 'bb_items',
                type: {
                    GET_ITEM_DETAIL: GET_BB_ITEM_DETAIL,
                    GET_ITEM_ONLINE_PRICE: GET_BB_ITEMS_ONLINE_PRICE,
                    ADD_ITEM_SPEC: ADD_BB_ITEM_SPEC,
                    ITEMS_ONLINE_PRICE_LOADING: BB_ITEMS_ONLINE_PRICE_LOADING,
                    CLEAR_ERRORS: CLEAR_BESTBUY_ERRORS,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
                }
            }
        default:
            console.error(`[ERROR] storeSwitch did not receive store name`);
    }
}


export const getItemsOnlinePrice = (store) => (dispatch, getState) => {
    const { routes, type } = setRouteOnStore(store);    //get routes and action types on store selection

    dispatch(setItemsOnlinePriceLoading(type.ITEMS_ONLINE_PRICE_LOADING));

    axios.get(`/api/${routes}/getOnlinePrice`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: type.GET_ITEM_ONLINE_PRICE
            })
            dispatch(clearMessages())
            dispatch(returnMessages(res.data.msg, res.status))
        }).catch(err => {
            dispatch(clearErrors(type.CLEAR_ERRORS))
            dispatch(returnErrors(err, err.response.status))

        })
}

// export const onRetrievedItemsOnlinePrice = (store) => (dispatch, getState) => {
//     const { routes, type } = setRouteOnStore(store);    //get routes and action types on store selection
//     dispatch({
//         type: type.ON_RETRIEVED_ONLINE_PRICE
//     });
// }

export const getItemDetail = (store, _id) => dispatch => {

    dispatch(setItemsLoading());
    const { routes, type } = setRouteOnStore(store);    //get routes and action types on store selection
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
            let errorMsg = `[ERROR] getItems invalid ${store}`
            dispatch(returnErrors(errorMsg, 404));
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
            dispatch(clearMessages())
            dispatch(returnMessages(res.data.msg, res.status))
        })
        .catch(e => {
            dispatch(returnErrors(e.response.data.msg, e.response.status))
        })
}

const clearErrors = (ERROR_TYPE) => {
    return {
        type: ERROR_TYPE
    }
}