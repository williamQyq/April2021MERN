import axios from 'axios';
import store from 'store.js';
import { tokenConfig } from './authActions.js';
import { clearErrors, returnErrors } from './errorActions.js';
import { clearMessages, returnMessages } from './messageActions.js';
import {
    CONFIRM_SHIPMENT,
    GET_ERRORS,
    // GET_INVENTORY_RECEIVED,
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
    GET_SHIPMENT_ITEMS_WITH_LIMIT,
    GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
    INVENTORY_RECEIVED_LOADING,
    SERVICE_UNAVAILABLE,
    SHIPMENT_ITEMS_LOADING,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
} from './types.js';

export const syncInventoryReceivedWithGsheet = () => (dispatch, getState) => {
    dispatch(setInventoryReceivedLoading())
    axios.get(`/api/wms/inventoryReceived/syncGsheet`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: SYNC_INVENTORY_RECEIVED_WITH_GSHEET,
                payload: res.data
            })
            dispatch(clearMessages())
            dispatch(returnMessages(res.data.msg, res.status))
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
}

export const getInventoryReceived = (requiredFields) => (dispatch, getState) => {
    // dispatch(setInventoryReceivedLoading());
    let params = {};
    let paramsURL = ""
    axios.get(`/api/wms/inventoryReceivedItems/${paramsURL}`,
        { ...tokenConfig(getState), params: { params } }
    )
        .then(receivedItems => {
            dispatch({
                type: GET_INVENTORY_RECEIVED_ITEMS,
                payload: receivedItems.data
            });
        })
        .catch(err => {
            dispatch({
                type: GET_INVENTORY_RECEIVED_ITEMS,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
        })
}
//working get Shipment for search

// export const getShipment = (requiredFields) => (dispatch, getState) => {
//     let params = {};
//     let paramsURL = ""
//     axios.get(`/api/wms/shipmentItems/${paramsURL}`,
//         { ...tokenConfig(getState), params: { params } }
//     )
//         .then(shippedItems => {
//             dispatch({
//                 type: GET_INVENTORY_RECEIVED_ITEMS,
//                 payload: receivedItems.data
//             });
//         })
//         .catch(err => {
//             dispatch({
//                 type: GET_INVENTORY_RECEIVED_ITEMS,
//                 payload: []
//             })
//             dispatch(clearErrors());
//             dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
//         })
// }

//axios get needtoship documents for inifite scroll
export const getNeedToShipFromShipmentWithLimit = (docLimits, docSkip) => (dispatch, getState) => {
    dispatch(setShipmentItemsLoading());
    axios.get(`/api/wms/shipment/getNeedToShipItems/limit/${docLimits}/skip/${docSkip}`, { ...tokenConfig(getState), params: { docLimits, docSkip } })
        .then(res => {
            dispatch({
                type: GET_SHIPMENT_ITEMS_WITH_LIMIT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: GET_SHIPMENT_ITEMS,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
        })
}

export const getNeedToShipPendingAndTotalCount = async (orgNm = "M") => {
    const getState = store.getState;
    return axios.get(`/api/wms/shipment/getPendingAndTotal/${orgNm}`, { ...tokenConfig(getState), params: { orgNm } })
        .then(res => res.data);
}

const setInventoryReceivedLoading = () => {
    return {
        type: INVENTORY_RECEIVED_LOADING
    }
}
const setShipmentItemsLoading = () => {
    return {
        type: SHIPMENT_ITEMS_LOADING
    }
}

//get shipped but not qty deducted shipment info
export const getShippedNotVerifiedShipmentByDate = (dateRange) => (dispatch, getState) => {
    const [dateMin, dateMax] = dateRange;
    axios.get(`/api/wms/shipment/getNotVerifiedShipment/dateMin/${dateMin}/dateMax/${dateMax}`, { ...tokenConfig(getState), params: { dateMin, dateMax } })
        .then((res) => {
            dispatch({
                type: GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
        })
}
export const confirmShipmentAndSubTractQty = (unShipmentArr) => async (dispatch, getState) => {
    if (unShipmentArr.length <= 0) {
        dispatch(returnMessages("No Shipment selected", 202, SERVICE_UNAVAILABLE));
        return;
    }
    return axios.post('/api/wms/needToShip/confirmShipment', { allUnShipment: unShipmentArr }, tokenConfig(getState))
        .then((res) => {
            dispatch(returnMessages(res.data.msg, res.status, CONFIRM_SHIPMENT))
        })
        .catch(err => {
            console.log(`err reason: `, err.response.data.reason)
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS, err.response.data.reason));
        })
}