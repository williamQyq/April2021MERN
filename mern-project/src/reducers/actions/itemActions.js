import axios from 'axios';
import Moment from 'moment';
import { getBBItems } from './itemBBActions.js';
import { getMSItems } from './itemMSActions.js';
import { clearErrors, returnErrors } from './errorActions.js'
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
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    SERVICE_UNAVAILABLE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR,
    GET_ERRORS,
} from './types.js';
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

//@status: deprecated
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

//@status: deprecated
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
                routes: 'microsoft',
                type: {
                    GET_ITEM_DETAIL: GET_MS_ITEM_DETAIL,
                    GET_ITEM_ONLINE_PRICE: GET_MS_ITEMS_ONLINE_PRICE,
                    ITEMS_ONLINE_PRICE_LOADING: MS_ITEMS_ONLINE_PRICE_LOADING,
                    CLEAR_ERRORS: CLEAR_MICROSOFT_ERRORS,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
                    FAILED_RETRIEVE_ONLINE_PRICE: RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
                }
            }
        case BESTBUY:
            return {
                routes: 'bestbuy',
                type: {
                    GET_ITEM_DETAIL: GET_BB_ITEM_DETAIL,
                    GET_ITEM_ONLINE_PRICE: GET_BB_ITEMS_ONLINE_PRICE,
                    ADD_ITEM_SPEC: ADD_BB_ITEM_SPEC,
                    ITEMS_ONLINE_PRICE_LOADING: BB_ITEMS_ONLINE_PRICE_LOADING,
                    CLEAR_ERRORS: CLEAR_BESTBUY_ERRORS,
                    ON_RETRIEVED_ONLINE_PRICE: ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
                    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR: RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR
                }
            }
        default:
            return;
    }
}


export const getItemsOnlinePrice = (store) => (dispatch, getState) => {
    const { routes, type } = setRouteOnStore(store);    //get routes and action types on store selection
    if (routes && type) {
        dispatch(setItemsOnlinePriceLoading(type.ITEMS_ONLINE_PRICE_LOADING));
        dispatch(returnMessages("Working on online price retrieval...\nPlease wait.", 202, type.ITEMS_ONLINE_PRICE_LOADING));
        axios.get(`/api/${routes}/crawl/v0/getOnlinePrice`, tokenConfig(getState))
            .catch(err => {
                dispatch(clearMessages())
                dispatch(returnMessages(err.response.msg, err.response.status, GET_ERRORS))
            })
    }
}

export const handleOnRetrievedItemsOnlinePrice = (store, msg) => dispatch => {
    const { type } = setRouteOnStore(store);    //get routes and action types on store selection
    if (type) {
        dispatch({
            type: type.GET_ITEM_ONLINE_PRICE
        })
        dispatch(clearMessages())
        dispatch(returnMessages(msg, 200, type.GET_ITEM_ONLINE_PRICE))
    }

}

export const handleErrorOnRetrievedItemsOnlinePrice = (store, errorMsg) => dispatch => {
    const { type } = setRouteOnStore(store);
    if (type) {
        dispatch(clearErrors(type.CLEAR_ERRORS))
        dispatch(returnErrors(errorMsg, 502, RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR))
    }
}

export const getItemDetail = (store, _id) => dispatch => {

    dispatch(setItemsLoading());
    const { routes, type } = setRouteOnStore(store);    //get routes and action types on store selection
    axios.get(`/api/${routes}/peek/v0/getProductDetail/id/${_id}`).then(res => {
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

export const setTableState = (settings) => dispatch => {
    dispatch(setItemsLoading());
    let tableState = { ...settings }

    dispatch({
        type: SET_TABLE_STATE,
        payload: tableState
    })
}


export const addItemSpec = (record, store) => (dispatch, getState) => {
    dispatch(setItemsLoading);
    const { routes, type } = setRouteOnStore(store)
    if (type.ADD_ITEM_SPEC === undefined) {
        dispatch(clearMessages())
        dispatch(returnMessages("Get Item Specification is currently not available ", 202, SERVICE_UNAVAILABLE))
        return;
    }

    dispatch(returnMessages("Working on online price retrieval...\nPlease wait.", 202, type.ADD_ITEM_SPEC))
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
