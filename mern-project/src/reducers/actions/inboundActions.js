import axios from 'axios';
import { tokenConfig } from './authActions.js';
import { returnErrors } from './errorActions.js';

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
    onError("err")
}
export const uploadNeedToShip = (file, onSuccess, onError) => (dispatch, getState) => {
    onError("err")
}