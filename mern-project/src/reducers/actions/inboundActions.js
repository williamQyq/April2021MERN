import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import { returnMessages } from './messageActions.js';
import { GET_ERRORS, SERVICE_UNAVAILABLE, UPDATE_INVENTORY_RECEIVE } from './types.js';
import Papa from "papaparse";
import fileDownload from 'js-file-download';

export const getInvReceive = () => (dispatch, getState) => (
    axios.get(`/api/inbound/inv-receive/wrongadds`, tokenConfig(getState))
        .then(result => {
            return result
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
)

export const updateInventoryReceivedByUpload = (file, onSuccess, onError) => (dispatch, getState) => {
    // onError("err")
    Papa.parse(file, {
        complete: (results) => {
            const uploadFile = results.data;
            axios.post('/api/wms/inventoryReceive/updateRecOnTracking', { uploadFile }, tokenConfig(getState))
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
    axios.get('/api/wms/downloadSampleXlsx/inventoryReceive', { responseType: "blob" }).then((res) => {
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