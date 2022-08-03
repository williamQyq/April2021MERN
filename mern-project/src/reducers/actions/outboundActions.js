import axios from 'axios';
import store from 'store.js';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import { clearMessages, returnMessages } from './messageActions.js';
import {
    GET_ERRORS,
    // GET_INVENTORY_RECEIVED,
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
    GET_SHIPMENT_ITEMS_WITH_LIMIT,
    GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
    INVENTORY_RECEIVED_LOADING,
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

export const getInventoryReceived = () => (dispatch, getState) => {
    dispatch(setInventoryReceivedLoading());
    axios.get(`/api/wms/inventoryReceivedItems`, tokenConfig(getState))
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
            dispatch(returnErrors(err.response.data.msg, err.response.status));
        })
}

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
            console.log(res.data)
            dispatch({
                type: GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS))
        })
}