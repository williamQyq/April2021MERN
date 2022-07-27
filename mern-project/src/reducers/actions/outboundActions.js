import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import { clearMessages, returnMessages } from './messageActions.js';
import {
    GET_ERRORS,
    // GET_INVENTORY_RECEIVED,
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
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
export const getNeedToShipFromShipment = (docLimits, docSkip) => (dispatch, getState) => {
    dispatch(setShipmentItemsLoading());
    axios.get(`/api/wms/getNeedToShipItems/limit/${docLimits}/skip/${docSkip}`, { ...tokenConfig(getState), params: { docLimits, docSkip } })
        .then(res => {
            dispatch({
                type: GET_SHIPMENT_ITEMS,
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