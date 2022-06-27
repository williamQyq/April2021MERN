import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import {
    GET_INVENTORY_RECEIVED,
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
    INVENTORY_RECEIVED_LOADING,
    SHIPMENT_ITEMS_LOADING,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
} from './types.js';

export const syncInventoryReceivedWithGsheet = () => (dispatch, getState) => {
    dispatch(setInventoryReceivedLoading())
    axios.get(`/api/wms/inventoryReceived/syncGsheet`, tokenConfig(getState))
        .then((status) => {
            dispatch({
                type: SYNC_INVENTORY_RECEIVED_WITH_GSHEET,
                payload: status.data
            })
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
            dispatch(returnErrors(err.response.data.msg, err.response.status));
        })
}
export const getNeedToShipFromShipment = () => (dispatch, getState) => {
    dispatch(setShipmentItemsLoading());
    axios.get(`/api/wms/getNeedToShipItems`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_SHIPMENT_ITEMS,
                payload: res.data
            })
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