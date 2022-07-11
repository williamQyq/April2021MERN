import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';
import { returnMessages } from './messageActions.js';
import { SERVICE_UNAVAILABLE, UPDATE_INVENTORY_RECEIVE } from './types.js';
import Papa from "papaparse";


export const getInvReceive = () => (dispatch, getState) => (
    axios.get(`/api/inbound/inv-receive/wrongadds`, tokenConfig(getState))
        .then(result => {
            return result
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status))
        })
)

export const uploadInventoryReceived = (file, onSuccess, onError) => (dispatch, getState) => {
    // onError("err")
    Papa.parse(file, {
        complete: (results) => {
            const uploadFile = results.data;
            axios.post('/api/inbound/inventoryReceive/updateRecOnTracking', { uploadFile })
                .then(res => {
                    dispatch({
                        type: UPDATE_INVENTORY_RECEIVE,
                    });
                    onSuccess(res.data.msg);
                    dispatch(returnMessages(res.data.msg, res.status, UPDATE_INVENTORY_RECEIVE))
                })
                .catch(err => {
                    onError(err);
                    dispatch(returnErrors(err.response.data.msg, err.response.status));
                })
        },
        error: err => {
            onError(err)
            dispatch(returnMessages("Service is currently unavilable.", 202, SERVICE_UNAVAILABLE))
        }
    })
}
export const uploadNeedToShip = (file, onSuccess, onError) => (dispatch, getState) => {
    onError("err")
    dispatch(returnMessages("Service is currently unavilable.", 202, SERVICE_UNAVAILABLE))
}

