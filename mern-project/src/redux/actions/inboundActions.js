import axios from 'axios';
import { tokenConfig } from './authActions';
import { clearErrors, returnErrors } from './errorActions';
import { returnMessages } from './messageActions';
import Papa from "papaparse";
import fileDownload from 'js-file-download';
import {
    GET_ERRORS,
    SERVICE_UNAVAILABLE,
    UPDATE_INVENTORY_RECEIVE,
    GET_INVENTORY_RECEIVED_ITEMS,
    SEARCH_RECEIVAL_SHIPMENT,
    SEARCH_LOCATION_INVENTORY,
    SEARCH_SELLER_INVENTORY
} from './types.js';
import {
    setInventoryReceivedLoading,
    setSearchShipmentLoading
} from './loadingActions.js';

export const getInvReceivedWithWrongAdds = () => (dispatch, getState) => (
    axios.get(`/api/wms/inventoryReceive/v0/getWrongAdds`, tokenConfig(getState))
        .then(result => {
            return result
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
)

export const getInventoryReceivedFromSearch = (requiredFields) => (dispatch, getState) => {
    dispatch(setSearchShipmentLoading());
    axios.post(`/api/wms/inventoryReceive/v0/getInventoryReceived`, { requiredFields }, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SEARCH_RECEIVAL_SHIPMENT,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SEARCH_RECEIVAL_SHIPMENT,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
        })
}

export const getInventoryReceived = (requiredFields = {}) => (dispatch, getState) => {
    dispatch(setInventoryReceivedLoading());
    axios.post(`/api/wms/inventoryReceive/v0/getInventoryReceived`, { requiredFields }, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_INVENTORY_RECEIVED_ITEMS,
                payload: res.data
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

export const downloadInventoryReceived = (requiredFields = {}) => (dispatch, getState) => {
    axios.post('/api/wms/inventoryReceive/v0/downloadReceivalXlsx', { requiredFields, responseType: "blob" })
        .then((res) => {
            fileDownload(res.data, 'receivalRecords.xlsx')
        })
}

export const updateInventoryReceivedByUpload = (options) => (dispatch, getState) => {
    const { file, onSuccess, onError } = options //type UploadRequestOptions 

    Papa.parse(file, {
        complete: (results) => {
            const uploadFile = results.data;
            axios.post('/api/wms/inventoryReceive/v0/updateRecOnTracking', { uploadFile }, tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: UPDATE_INVENTORY_RECEIVE,
                    });
                    if (res.data.rejected) {
                        onError(res.data.msg)
                        dispatch(returnErrors(res.data.msg, 400, GET_ERRORS))
                    } else {
                        onSuccess(res.data.msg);
                        dispatch(returnMessages(res.data.msg, res.status, UPDATE_INVENTORY_RECEIVE))
                    }

                })
                .catch(err => {
                    onError(err);
                    dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
                })
        },
        error: err => {
            onError(err)
            dispatch(returnMessages("Service is currently unavilable.", 202, SERVICE_UNAVAILABLE))
        }
    })
}

export const downloadInventoryReceivedUploadSample = () => dispatch => {
    axios.post('/api/wms/inventoryReceive/v0/downloadSampleXlsx', { responseType: "blob" }).then((res) => {
        fileDownload(res.data, 'inventoryReceived.xlsx')
    })
}


export const uploadNeedToShip = (file, onSuccess, onError) => (dispatch, getState) => {
    onError("err")
    dispatch(returnMessages("Service is currently unavilable.", 202, SERVICE_UNAVAILABLE))
}

export const syncFromNeedToShipGsheet = () => (dispatch, getState) => {
    dispatch(returnMessages("Service is currently unavilable.", 202, SERVICE_UNAVAILABLE))
    // axios.get('/api/wms/needToShip/syncGsheet', tokenConfig(getState))
    //     .then((res) => {

    //     })
}

export const getLocationInventory = (requiredFields) => (dispatch, getState) => {
    dispatch(setSearchShipmentLoading());

    axios.post(`/api/wms/locationInventory/v0/getLocationInventory`, { requiredFields }, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SEARCH_LOCATION_INVENTORY,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SEARCH_LOCATION_INVENTORY,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
        })
}

export const getSellerInventory = (requiredFields) => (dispatch, getState) => {
    dispatch(setSearchShipmentLoading());
    axios.post(`/api/wms/sellerInventory/v0/getSellerInventory`, { requiredFields }, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SEARCH_SELLER_INVENTORY,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: SEARCH_SELLER_INVENTORY,
                payload: []
            })
            dispatch(clearErrors());
            dispatch(returnErrors(err.response.data.msg, err.response.status, GET_ERRORS));
        })
}

export const downloadLocationInventory = (requiredFields = {}) => (dispatch, getState) => {
    axios.post('/api/wms/locationInventory/v0/downloadLocationInventoryXlsx', { requiredFields, responseType: "blob" })
        .then((res) => {
            fileDownload(res.data, 'locationRecords.xlsx')
        })
}